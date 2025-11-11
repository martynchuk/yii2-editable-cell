<?php

namespace martynchuk\editablecell;

use Yii;
use yii\grid\DataColumn;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\helpers\Url;
use yii\web\JsExpression;

/**
 * EditableColumn renders an editable column in a grid.
 *
 * @author Yurii Martynchuk <yura@martynchuk.com>
 */
class EditableColumn extends DataColumn
{
    /**
     * @var string the type of input. Can be 'text', 'textarea', 'select', 'date', etc.
     */
    public $editableType = 'text';

    /**
     * @var array options for the editable input
     */
    public $editableOptions = [];

    /**
     * @var string|array|JsExpression the URL to submit the edited value
     */
    public $editableUrl;

    /**
     * @var string the attribute name for the primary key
     */
    public $primaryKey = 'id';

    /**
     * @var string|JsExpression JavaScript callback function after successful save
     */
    public $afterSave;

    /**
     * @var string|JsExpression JavaScript callback function on error
     */
    public $onError;

    /**
     * @var array HTML options for the editable cell
     */
    public $cellOptions = ['class' => 'editable-cell'];

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();

        if ($this->attribute === null) {
            throw new \InvalidArgumentException('The "attribute" property must be set for EditableColumn.');
        }

        if ($this->editableUrl === null) {
            $this->editableUrl = Yii::$app->request->url;
        } elseif (is_array($this->editableUrl)) {
            // Convert array URL to string
            $this->editableUrl = Url::to($this->editableUrl);
        }

        EditableCellAsset::register($this->grid->view);
    }

    /**
     * {@inheritdoc}
     */
    protected function renderDataCellContent($model, $key, $index)
    {
        $value = $this->getDataCellValue($model, $key, $index);
        $primaryKeyValue = $model->{$this->primaryKey};

        $options = array_merge($this->cellOptions, [
            'data-editable' => 'true',
            'data-attribute' => $this->attribute,
            'data-primary-key' => $primaryKeyValue,
            'data-type' => $this->editableType,
            'data-url' => $this->editableUrl,
        ]);

        if ($this->editableOptions) {
            $options['data-options'] = Json::encode($this->editableOptions);
        }

        if ($this->afterSave) {
            $options['data-after-save'] = $this->afterSave instanceof JsExpression 
                ? $this->afterSave->expression 
                : $this->afterSave;
        }

        if ($this->onError) {
            $options['data-on-error'] = $this->onError instanceof JsExpression 
                ? $this->onError->expression 
                : $this->onError;
        }

        return Html::tag('div', Html::encode($value), $options);
    }
}

