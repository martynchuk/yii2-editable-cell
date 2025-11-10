<?php

namespace martynchuk\editablecell;

use yii\web\AssetBundle;

/**
 * Asset bundle for EditableCell widget
 *
 * @author Yurii Martynchuk <yura@martynchuk.com>
 */
class EditableCellAsset extends AssetBundle
{
    public $sourcePath = __DIR__ . '/../assets';

    public $css = [
        'css/editable-cell.css',
    ];

    public $js = [
        'js/editable-cell.js',
    ];

    public $depends = [
        'yii\web\YiiAsset',
    ];
}

