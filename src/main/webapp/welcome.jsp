<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Akṣi: Handwritten-digit-recognizing neural network</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
    <script src="/js/aksi.js"></script>
    <script type="text/javascript">
       jQuery(document).ready(init);
    </script>

    <!-- Le HTML5 shim, for IE6-8 support of HTML elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le styles -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <style type="text/css">
      /* Override some defaults */
      html, body {
        background-color: #eee;
      }
      body {
        padding-top: 40px; /* 40px to make the container go all the way to the bottom of the topbar */
      }
      .container > footer p {
        text-align: center; /* center align it with the container */
      }
      .container {
        width: 820px; /* downsize our container to make the content feel a bit tighter and more cohesive. NOTE: this removes two full columns from the grid, meaning you only go to 14 columns and not 16. */
      }

      /* The white background content wrapper */
      .content {
        background-color: #fff;
        padding: 20px;
        margin: 0 -20px; /* negative indent the amount of the padding to maintain the grid system */
        -webkit-border-radius: 0 0 6px 6px;
           -moz-border-radius: 0 0 6px 6px;
                border-radius: 0 0 6px 6px;
        -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.15);
           -moz-box-shadow: 0 1px 2px rgba(0,0,0,.15);
                box-shadow: 0 1px 2px rgba(0,0,0,.15);
      }

      /* Page header tweaks */
      .page-header {
        background-color: #f5f5f5;
        padding: 20px 20px 10px;
        margin: -20px -20px 20px;
      }

      /* Styles you shouldn't keep as they are for displaying this base example only */
      .content .span10,
      .content .span4 {
        min-height: 500px;
      }
      /* Give a quick and non-cross-browser friendly divider */
      .content .span4 {
        margin-left: 0;
        padding-left: 19px;
        border-left: 1px solid #eee;
      }

      .topbar .btn {
        border: 0;
      }

    </style>

  </head>

  <body>

    <div class="topbar">
      <div class="fill">
        <div class="container">
          <a class="brand" href="#">Akṣi</a>
          <ul class="nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="content">
        <div class="page-header">
          <h1>Akṣi <small>Handwritten-digit-recognizing neural-network</small></h1>
        </div>
        <div class="row" style="padding-bottom: 20px">
          <div class="span14" style="text-align: justify">
            <h2>What is Akṣi?</h2>

            Akṣi is a handwritten-digit-recognizing neural-network that I created for a semester project in my Advanced Data Structures and Algorithms class at ASU Poly. Our professor asked up to pick
            any topic we liked. I've always been interested in Neural Networks, but I never really got the time to learn about them. I decided to use this opportunity to realize my interest. Armed with
            tutorials, examples, and research papers I set about creating my network. It was challenging, but at the end I learnt a lot.
         </div>
      </div>
      <div class="row" style="padding-bottom: 20px">
          <div class="span14" style="text-align: justify">
            <h2>How did you train Akṣi?</h2>
            Akṣi was trained using the stochastic backpropagation-algorithm with a momentum term. The network was also trained by using a very simple form of annealing (&#956;<sub>t</sub> = &#956;<sub>0</sub>
            / (1 + t/T) where &#956;<sub>0</sub> is the initial rate). The simple annealing helped damp the oscillations I was getting towards the end of the training session. I also tried using a moving-average
            of the errors from the last 25 epochs as the error threshold. However, this increased the training-time of the network substantially. The error threshold for the trained network is 0.005, or 0.5%.
            The training and testing for Akṣi comes from MNIST's database of hand-written digits, which I found <a href = "http://yann.lecun.com/exdb/mnist/">here</a>. The digits are represented by a 28x28 matrix
            with values between 0 and 255. In contrast to standard RGB values, 255 stands for black and 0 stands for white. The images are therefore in greyscale. To normalizes the values to 0 or 1, I used
            <a href = "http://en.wikipedia.org/wiki/Otsu's_method">Otsu's method</a> to convert the grey-scale images to black and white.
          </div>
      </div>
      <div class="row" style="padding-bottom: 20px">
          <div class="span14" style="text-align: justify">
            <h2>What language did you use?</h2>
            Akṣi was created using Java, but I didn't use existing neural-net frameworks like <a href = "http://www.heatonresearch.com/encog">Encog</a> to train my network. I created the classes from scratch and
            implemented the backpropagation algorithm myself. After the network was trained, I persisted the serialzed the objects that represent the network to a file. This way, I could load up previously-trained
            networks and use them.
          </div>
      </div>
      <div class="row" style="padding-bottom: 20px">
          <div class="span14" style="text-align: justify">
            <h2>So can I try it out?</h2>
            You sure can! Try writing a digit in the square provided and Akṣi will recognize it! However, there are a few things to remember. Please make sure that the digit you write more or less fits into the
            space provided (so don't make the digit too small). The canvas is 80x80, but I scale and center the image into 20x20 and then center it inside a 28x28 image.
          </div>
      </div>
      <div class="row" style="padding-bottom: 20px">
          <div class="span14" style="text-align: center">
              <canvas id="digitView" width="80" height="80" style="border:1px solid #000000; background-color:#eeeeee; cursor: crosshair">
                  <p>Unfortunately, your browser is currently unsupported by our web
                     application.  We are sorry for the inconvenience. Please use one of the
                     supported browsers listed below, or draw the image you want using an
                     offline tool.</p>
                  <p>Supported browsers: <a href="http://www.opera.com">Opera</a>, <a
                     href="http://www.mozilla.com">Firefox</a>, <a
                     href="http://www.apple.com/safari">Safari</a>, and <a
                     href="http://www.konqueror.org">Konqueror</a>.</p>
              </canvas>

              <br />

              <img id="spinner" src = "/images/spinner.gif" style = "display:none;" />

              <br />

              <div id="result" class="alert-message block-message success" style="width: 500px; margin-right:auto; margin-left:auto; display:none; text-align:justify;">
                  <p><strong>Well done!</strong> You successfully read this alert message. Cum sociis natoque penatibus
                      et magnis dis parturient montes, nascetur ridiculus mus. Maecenas faucibus mollis interdum.</p>
              </div>

              <div id="error" class="alert-message error" style="width: 400px; margin-right:auto; margin-left:auto; display:none">
                   <p><strong>Holy guacamole!</strong> Best check yo self, you’re not looking too good.</p>
              </div>

              <input id="recognize" type="button" value="Recognize Digit" class="btn primary" />&nbsp;&nbsp;&nbsp;&nbsp;<input id="clear" type="button" class="btn" value="Clear" />
          </div>
      </div>

      <footer>
        <p>&copy; vivin.net 2011</p>
      </footer>

    </div> <!-- /container -->
    </div>
  </body>
</html>
