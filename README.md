# yii2-editable-cell

Yii2 GridView Editable Cell - editable cells in GridView for Yii2.

## Installation

Install the extension via Composer:

```bash
composer require martynchuk/yii2-editable-cell
```

or add to `composer.json`:

```json
{
    "require": {
        "martynchuk/yii2-editable-cell": "*"
    }
}
```

## Usage

### Basic Usage

In your GridView use `EditableColumn` instead of a regular column:

```php
use martynchuk\editablecell\EditableColumn;

echo GridView::widget([
    'dataProvider' => $dataProvider,
    'columns' => [
        'id',
        [
            'class' => EditableColumn::class,
            'attribute' => 'name',
            'editableUrl' => ['site/update'],
        ],
        'email',
    ],
]);
```

### Configuration

```php
[
    'class' => EditableColumn::class,
    'attribute' => 'status',
    'editableType' => 'select', // text, textarea, select, date, number
    'editableUrl' => ['user/update-status'],
    'editableOptions' => [
        'items' => [
            ['value' => 1, 'label' => 'Active'],
            ['value' => 0, 'label' => 'Inactive'],
        ],
    ],
    'primaryKey' => 'id',
    'pjaxContainer' => '#grid-pjax', // Pjax container selector to reload after save
    'afterSave' => 'onStatusUpdated', // JavaScript callback
    'onError' => 'onUpdateError', // JavaScript callback
]
```

### Edit Types

- **text** - text input field (default)
- **textarea** - multiline text field
- **select** - dropdown list (requires `editableOptions['items']`)
- **date** - date picker field
- **number** - number input field

### Server-side Handling

#### Option 1: Using EditableHelper (Recommended)

Use the built-in helper class for easy processing:

```php
use martynchuk\editablecell\EditableHelper;

public function actionEditable()
{
    return EditableHelper::process(YourModel::class);
}
```

#### Option 2: Manual Handling

Create an action to handle updates manually:

```php
public function actionUpdate()
{
    Yii::$app->response->format = Response::FORMAT_JSON;
    
    $id = Yii::$app->request->post('id');
    $attribute = Yii::$app->request->post('attribute');
    $value = Yii::$app->request->post($attribute);
    
    $model = YourModel::findOne($id);
    if ($model) {
        $model->$attribute = $value;
        if ($model->save()) {
            return [
                'success' => true,
                'value' => $model->$attribute,
            ];
        }
    }
    
    return [
        'success' => false,
        'message' => 'Save error',
    ];
}
```

## Project Structure

```
yii2-editable-cell/
├── assets/
│   ├── css/
│   │   └── editable-cell.css
│   └── js/
│       └── editable-cell.js
├── src/
│   ├── Bootstrap.php
│   ├── EditableCellAsset.php
│   ├── EditableColumn.php
│   └── EditableHelper.php
├── tests/
├── composer.json
├── LICENSE
└── README.md
```

## License

MIT License

## Author

Yurii Martynchuk <yura@martynchuk.com>
