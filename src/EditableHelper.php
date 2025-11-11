<?php

namespace martynchuk\editablecell;

use Yii;
use yii\web\Response;
use yii\db\ActiveRecord;

/**
 * Universal helper for processing editable cell requests
 *
 * @author Yurii Martynchuk <yura@martynchuk.com>
 */
class EditableHelper
{
    /**
     * Universal handler for editable requests
     * 
     * @param string $modelClass Model class (e.g., 'app\models\Article')
     * @return array
     */
    public static function process($modelClass)
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        
        $posted = Yii::$app->request->post();
        $id = $posted['id'] ?? null;
        
        // Remove service fields
        $skipFields = ['id', 'attribute', '_csrf', '_csrf-frontend', '_csrf-backend'];
        $posted = array_diff_key($posted, array_flip($skipFields));
        
        // First remaining element = attribute => value
        if (empty($posted)) {
            return self::error('No data to update');
        }
        
        $attribute = key($posted);
        $value = current($posted);

        if (!$id || !$attribute) {
            return self::error('Missing id or attribute', [
                'id' => $id, 
                'attribute' => $attribute, 
                'post_data' => Yii::$app->request->post()
            ]);
        }
        
        /** @var ActiveRecord $model */
        $model = $modelClass::findOne($id);
        if (!$model) {
            return self::error('Model not found');
        }
        
        if (!$model->hasAttribute($attribute)) {
            return self::error("Attribute does not exist: \"{$attribute}\"");
        }
        
        try {
            $model->setAttribute($attribute, $value);
            
            if ($model->save()) {
                return [
                    'success' => true,
                    'value' => $model->getAttribute($attribute),
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $model->errors,
                ];
            }
        } catch (\Exception $e) {
            return self::error('Error: ' . $e->getMessage());
        }
    }
    
    /**
     * Format error response
     * 
     * @param string $message
     * @param array $debug
     * @return array
     */
    private static function error($message, $debug = [])
    {
        $result = [
            'success' => false,
            'message' => $message,
        ];
        
        if (!empty($debug)) {
            $result['debug'] = $debug;
        }
        
        return $result;
    }
}

