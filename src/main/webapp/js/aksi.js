function init() {
    var canvasHeight = 80;
    var canvasWidth = 80;

    var scaledHeight = 20;
    var scaledWidth = 20;

    var leftMouseButton = false;
    var started = false;

    jQuery("#digitView").mousemove(function(event) {
        tweakEvent(event);

        var context = this.getContext('2d');

        if (leftMouseButton) {

            context.lineWidth = 5;

            var x = 0;
            var y = 0;

            if (event.layerX || event.layerX == 0) {
                x = event.layerX;
                y = event.layerY;
            }

            else if (event.offsetX || event.offsetX == 0) {
                x = event.offsetX;
                y = event.offsetY;
            }

            if (!started) {
                context.beginPath();
                context.moveTo(x, y);
                started = true;
            }

            else {
                context.lineTo(x, y);
                context.stroke();
            }
        }

        else {
            context.beginPath();
            context.moveTo(x, y);
        }
    });

    jQuery("#digitView").mousedown(function(event) {
        if (event.which == 1) {
            leftMouseButton = true;
        }

        return false; //prevents the text-selection cursor from showing up
    });

    jQuery("#digitView").mouseup(function(event) {
        if (event.which == 1) {
            leftMouseButton = false;
        }
    });

    jQuery("#clear").click(function() {
        clear(jQuery("#digitView").get(0));
    });

    jQuery("#recognize").click(function() {

        var canvas = jQuery("#digitView").get(0);
        var context = canvas.getContext('2d');

        var imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        var data = getImageData2DArray(imageData, canvasWidth);
        var minRow = canvasHeight + 1;
        var minCol = canvasWidth + 1;
        var maxRow = 0;
        var maxCol = 0;

        var str = "";
        for (var i = 0; i < canvasHeight; i++) {
            for (var j = 0; j < canvasWidth; j++) {
                str += data[i][j] + " ";

                if (data[i][j] > 0) {
                    minRow = (i < minRow) ? i : minRow;
                    minCol = (j < minCol) ? j : minCol;

                    maxRow = (i > maxRow) ? i : maxRow;
                    maxCol = (j > maxCol) ? j : maxCol;
                }
            }
            str += "\n";
        }

        var imageHeight = maxRow - minRow;
        var imageWidth = maxCol - minCol;

        if (imageHeight > 0 && imageWidth > 0) {

            jQuery("#spinner").show();

            var actualImageData = context.getImageData(minCol, minRow, imageWidth, imageHeight);

            var newCanvas = jQuery("<canvas></canvas>").attr("width", canvasWidth).attr("height", canvasHeight).get(0);
            newCanvas.getContext('2d').putImageData(actualImageData, 0, 0);

            //When scaling the image, we're increasing the height as much as we can and then scaling the width by the same amount
            var scaledContext = jQuery("<canvas></canvas>").attr("width", scaledWidth).attr("height", scaledHeight).get(0).getContext('2d');

            var scaledImageHeight = 0;
            var scaledImageWidth = 0;

            if (imageHeight >= imageWidth) {
                scaledImageHeight = scaledHeight;
                scaledImageWidth = imageWidth * (scaledHeight / imageHeight) > scaledWidth ? scaledWidth : imageWidth * (scaledHeight / imageHeight);
            }

            else {
                scaledImageHeight = imageHeight * (scaledWidth / scaledWidth) > scaledHeight ? scaledHeight : imageHeight * (scaledWidth / scaledWidth);
                scaledImageWidth = scaledWidth;
            }

            scaledContext.save();
            scaledContext.translate((scaledWidth - scaledImageWidth) / 2, 0);
            scaledContext.drawImage(newCanvas, 0, 0, imageWidth, imageHeight, 0, 0, scaledImageWidth, scaledImageHeight);
            scaledContext.restore();

            var scaledImageData = scaledContext.getImageData(0, 0, scaledWidth, scaledHeight).data;
            var scaledData = pad(otsu(getImageData2DArray(scaledImageData, scaledWidth)));

            var imageDataString = "";

            for(i = 0; i < 28; i++) {
                for(j = 0; j < 28; j++) {
                    imageDataString += scaledData[i][j];
                }
            }

            jQuery.ajax({
                url: "/digitrecognition/recognize.json",
                data: {
                    imageData: imageDataString
                },
                dataType: "json",
                success: function(data) {

                    jQuery("#spinner").hide();

                    if(!data.error) {
                        var result = "The digit you entered was recognized as a <b>" + data.first + "</b> with a confidence of <b>" + data.firstConfidence + "</b><br /><br />";

                        result += "The second and third choices were: <br />" +
                                  "<ul><li><b>" + data.second + "</b> with a confidence of <b>" + data.secondConfidence + "</b></li>" +
                                  "<li><b>" + data.third + "</b> with a confidence of <b>" + data.thirdConfidence + "</b></ul>"

                        jQuery("#result").html(result).fadeIn("slow");
                        setTimeout(function() {
                            jQuery("#result").fadeOut("slow");
                        }, 5000);
                    }

                    else {
                        jQuery("#error").html(data.message);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                    jQuery("#spinner").hide();

                    jQuery("#error").html("Server responded with an error: <b>" + errorThrown + "</b>").fadeIn("slow");
                    setTimeout(function() {
                        jQuery("#error").fadeOut("slow");
                    }, 3000);
                }
            });
        }

        else {
            jQuery("#error").html("You need to write something!").fadeIn("slow");
            setTimeout(function() {
                jQuery("#error").fadeOut("slow");
            }, 3000)
        }
    });

    //pads the 20x20 with zeroes so as to get a 28x28 image with a centered 20x20 image
    function pad(data) {
        var padded = [];
        for(var i = 0; i < 28; i++) {
            padded.push([]);
        }

        for(i = 0; i < 28; i++) {
            for(var j = 0; j < 28; j++) {
                if(typeof data[i - 4] === "undefined") {
                    padded[i][j] = 0;
                }

                else if(typeof data[i - 4][j - 4] === "undefined") {
                    padded[i][j] = 0;
                }

                else {
                    padded[i][j] = data[i - 4][j - 4];
                }
            }
        }

        var str = "";
        for (i = 0; i < 28; i++) {
            for (j = 0; j < 28; j++) {
                str += padded[i][j]
            }
            str += "\n";
        }

        return padded;
    }

    function getImageData2DArray(imageData, width) {
        var row = -1;
        var col = 0;

        var data = [];
        for (var i = 0; i < width; i++) {
            data.push([]);
        }

        for (i = 0; i < imageData.length; i += 4) {
            if (i % (width * 4) == 0) {
                row++;
                col = 0;
            }

            else {
                col++;
            }

            data[row][col] = imageData[i + 3];
        }

        return data;
    }

    function clear(canvas) {
        canvas.width = canvas.width;
    }

    function tweakEvent(event) {
        if (event.which == 1 && !leftMouseButton) {
            event.which = 0;
        }
    }

    //Uses Otsu's Threshold algorithm to convert from grayscale to black and white
    function otsu(data) {

        var histogram = [];

        for(var k = 0; k < scaledHeight * scaledWidth; k++) {
            histogram.push(0);
        }

        for (var i = 0; i < scaledHeight; i++) {
            for (var j = 0; j < scaledWidth; j++) {
                histogram[data[i][j]]++;
            }
        }

        var sum = 0;
        for (i = 0; i < histogram.length; i++) {
            sum += i * histogram[i];
        }

        var sumB = 0;
        var wB = 0;
        var wF = 0;

        var maxVariance = 0;
        var threshold = 0;

        i = 0;
        var found = false;

        while (i < histogram.length && !found) {
            wB += histogram[i];

            if (wB != 0) {
                wF = (scaledHeight * scaledWidth) - wB;

                if (wF != 0) {
                    sumB += (i * histogram[i]);

                    var mB = sumB / wB;
                    var mF = (sum - sumB) / wF;

                    var varianceBetween = wB * Math.pow((mB - mF), 2);

                    if (varianceBetween > maxVariance) {
                        maxVariance = varianceBetween;
                        threshold = i;
                    }
                }

                else {
                    found = true;
                }
            }

            i++;
        }

        for (i = 0; i < scaledHeight; i++) {
            for (j = 0; j < scaledWidth; j++) {
                data[i][j] = data[i][j] <= threshold ? 0 : 1;
            }
        }

        return data;
    }
}