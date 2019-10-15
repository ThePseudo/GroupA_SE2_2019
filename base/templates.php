<?php
function top($title)
{
    require_once("settings.php");
    ?>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <title><?php echo $title; ?></title>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <link rel='stylesheet' type='text/css' media='screen' href=<?php echo ("'" . $base . "base/style.css'"); ?>>
        <script src='main.js'></script>
    </head>

    <body>

    <?php
    }

    function bottom()
    {
        ?>
    </body>

    </html>
<?php
}
