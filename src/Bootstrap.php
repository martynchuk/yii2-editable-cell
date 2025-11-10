<?php

namespace martynchuk\editablecell;

use Yii;
use yii\base\BootstrapInterface;

/**
 * Bootstrap class for the extension
 *
 * @author Yurii Martynchuk <yura@martynchuk.com>
 */
class Bootstrap implements BootstrapInterface
{
    /**
     * {@inheritdoc}
     */
    public function bootstrap($app)
    {
        // Register asset paths if needed
        if (!isset(Yii::$aliases['@martynchuk/editablecell'])) {
            Yii::setAlias('@martynchuk/editablecell', __DIR__);
        }
    }
}

