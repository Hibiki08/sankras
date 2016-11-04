<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use app\models\Opinions;
use yii\data\Pagination;
use app\models\forms\EditOpinionsForm;
use yii\web\UploadedFile;
use yii\web\Response;
use yii\widgets\ActiveForm;
use yii\helpers\Url;
use app\models\Team;
use app\models\Certificates;
use app\components\Cache;

class AboutController extends Controller {

    use Cache;

    const PAGE_SIZE = 7;

    public function init() {
        parent::init(); // TODO: Change the autogenerated stub
        $this->myInit();
    }

    public function actionIndex() {
        $this->view->registerCssFile('/lib/fancyBox-18d1712/source/jquery.fancybox.css');
        $this->view->registerJsFile('/lib/fancyBox-18d1712/lib/jquery.mousewheel-3.0.6.pack.js');
        $this->view->registerJsFile('/lib/fancyBox-18d1712/source/jquery.fancybox.pack.js');

        $team = Team::findAll(['active' => 1]);
        $certificates = Certificates::findAll(['active' => 1]);


        return $this->render('index', [
            'team' => $team,
            'certificates' => $certificates
        ]);
    }

    public function actionOpinions() {
        session_start();
        $opinions = Opinions::find()->orderBy(['id' => SORT_DESC])->where(['active' => 1]);
        $pager = new Pagination(['totalCount' => $opinions->count(), 'pageSize' => self::PAGE_SIZE]);
        $pager->pageSizeParam = false;

        $opinions = $opinions->offset($pager->offset)
            ->limit($pager->limit)
            ->all();

        $form = new EditOpinionsForm();
        $session = Yii::$app->session;
        if (!$session->isActive) {
            $session->open();
        }

        if ($form->load(Yii::$app->request->post()) && $form->validate()) {
                $model = new Opinions();
                $form->photo = UploadedFile::getInstance($form, 'photo');

                $model->name = strip_tags(trim($form->name));
                $model->description = strip_tags(trim($form->description));
                $model->photo = isset($form->photo->name) ? $form->photo->name : '../../system/no-photo.jpg';
                $model->text = strip_tags(trim($form->text));
                $model->active = 0;
                $model->save();

            if (isset($form->photo->name)) {
                $id = Yii::$app->db->lastInsertID;

                $path = Opinions::IMG_FOLDER . 'opinion(' . $id . ')/';
                $create = file_exists(Yii::$app->basePath . '/web' . Yii::$app->params['params']['pathToImage'] . $path) ? true: mkdir(Yii::$app->basePath . '/web' . Yii::$app->params['params']['pathToImage'] . $path);
                if ($create) {
                    $form->upload($path, $form->photo);
                }
            }

            $session->set('success', true);
            Yii::$app->getResponse()->redirect(Url::toRoute(['about/opinions']));
            return false;
        }

        return $this->render('opinions', [
            'session' => $session,
            'opinions' => $opinions,
            'pager' => $pager,
            'opins' => $form,
        ]);
    }

}