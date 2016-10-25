<?php

namespace app\assets;

use Yii;
use yii\web\AssetBundle;

class OtherAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [

    ];
    public $js = [
//        'js/jquery-ui.min.js',
        'js/script.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\web\JqueryAsset'
    ];
    public $jsOptions = [
        'position' => \yii\web\View::POS_HEAD
    ];

}
