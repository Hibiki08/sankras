<?php

namespace app\controllers;

use Yii;
use app\models\forms\BaseForm;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\web\BadRequestHttpException;
use yii\web\HttpException;
use yii\web\View;
use yii\web\Controller;
use app\models\forms\LoginForm;
use app\models\forms\WriteUsForm;
use yii\helpers\Url;
use app\models\Requests;
use yii\helpers\Html;
use yii\web\Response;
use yii\widgets\ActiveForm;
use app\components\Cache;
use app\models\Prices;
use app\models\Seo;

class SiteController extends Controller {

    use Cache;

    const GET_ACCESS_DENIED = [
        'index',
        'contacts',
        'flat',
        'house',
        'company',
        'privacy-policy',
    ];

    public function init() {
        parent::init(); // TODO: Change the autogenerated stub
        $this->myInit();
    }

    public function beforeAction($action)
    {
        if (parent::beforeAction($action)) {
            if (in_array($action->id, self::GET_ACCESS_DENIED)) {
                if (!empty(Yii::$app->request->get())) {
                    throw new HttpException(404, 'Такой страницы нет!');
                    Yii::$app->end();
                }
                if ($action->id == 'privacy-policy') {
                    if (!empty(Yii::$app->request->post())) {
                        throw new HttpException(404, 'Такой страницы нет!');
                        Yii::$app->end();
                    }
                }
            }
        }

        return true;
    }

    public function actions() {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    public function actionLogin() {
        if (!\Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->loginAdmin()) {
            return Yii::$app->getResponse()->redirect(Url::toRoute(['/admin']));
        } else {
            return $this->render('login', [
                'model' => $model,
            ]);
        }
    }

    public function actionIndex() {
        $this->view->registerLinkTag(['rel' => 'canonical', 'href' => Url::to(['/'], true)]);
        $form = new BaseForm();
        $seoBottom = new Seo();
        $seoBottom->key = 'INDEX_BOTTOM';
        $seoBottom = $seoBottom->getAll(['active' => 1, 'block_key' => $seoBottom->key], $order = ['id' => SORT_ASC], 'one');

        if (Yii::$app->request->isAjax) {
            Yii::$app->response->format = Response::FORMAT_JSON;
            $validate = ActiveForm::validate($form);
            if ($validate) {
                ///Консультация мастера
                $adviceName = trim(Html::encode(Yii::$app->request->post('adviceName')));
                $advicePhone = trim(Html::encode(Yii::$app->request->post('advicePhone')));

                if ($advicePhone && $adviceName) {
                    $status = false;
                    $request = new Requests();
                    $request->name = $adviceName;
                    $request->phone = $advicePhone;
                    $request->type_id = Requests::ADVICE_ID;
                    $request->save();

                    $status = Yii::$app->mailer->compose()
                        ->setFrom(Yii::$app->system->get('email'))
                        ->setTo('sankras.pro@yandex.ru')
                        ->setSubject('Заявка на консультацию мастера')
                        ->setHtmlBody('Заявка на консультацию мастера.<br>Имя: ' . $adviceName .'<br>Телефон: ' . $advicePhone)
                        ->send();

                    return [
                        'status' => $status,
                    ];
                }

                //Обратный звонок
                $callPhone = trim(Html::encode(Yii::$app->request->post('callPhone')));
                $callPhone = trim(Html::encode($callPhone));

                if ($callPhone) {
                    $status = false;
                    $request = new Requests();
                    $request->phone = $callPhone;
                    $request->type_id = Requests::CALLBACK_ID;
                    $request->save();

                    $status = Yii::$app->mailer->compose()
                        ->setFrom(Yii::$app->system->get('email'))
                        ->setTo('sankras.pro@yandex.ru')
                        ->setSubject('Заявка на обратный звонок')
                        ->setTextBody('Нужно перезвонить по номеру: ' . $callPhone)
                        ->send();

                    return [
                        'status' => $status,
                    ];
                }

                //Дисконтная карта
                $cardMail = trim(Html::encode(Yii::$app->request->post('cardMail')));
                $cardMail = trim(Html::encode($cardMail));

                if ($cardMail) {
                    $status = false;
                    $request = new Requests();
                    $request->email = $cardMail;
                    $request->type_id = Requests::CARD_ID;
                    $request->save();

                    $status = Yii::$app->mailer->compose()
                        ->setFrom(Yii::$app->system->get('email'))
                        ->setTo('sankras.pro@yandex.ru')
                        ->setSubject('Получение дисконтной карты')
                        ->setHtmlBody('Заявка на получение дисконтной карты от: ' . $cardMail)
                        ->send();

                    $homeUrl = trim(Html::encode(Yii::$app->params['params']['host']));
                    $adminEmail = trim(Html::encode(Yii::$app->system->get('email')));
                    $adminPhone = trim(Html::encode(Yii::$app->system->get('phone')));
                    $adminSkype = trim(Html::encode(Yii::$app->system->get('skype')));

                    $status = Yii::$app->mailer->compose('discount', [
                        'homeUrl' => $homeUrl,
                        'adminEmail' => $adminEmail,
                        'adminPhone' => $adminPhone,
                        'adminSkype' => $adminSkype,
                    ])
                        ->setFrom(Yii::$app->system->get('email'))
                        ->setTo($cardMail)
                        ->setSubject('Получить дисконтную карту')
                        ->attach('files/Blank_discount_card.docx')
                        ->send();

                    return [
                        'status' => $status,
                    ];
                }

                //Вызвать мастера
                $masterName = Yii::$app->request->post('masterName');
                $masterPhone = Yii::$app->request->post('masterPhone');
                $masterName = trim(Html::encode($masterName));
                $masterPhone = trim(Html::encode($masterPhone));

                if ($masterName) {
                    $status = false;
                    $request = new Requests();
                    $request->name = $masterName;
                    $request->phone = $masterPhone;
                    $request->type_id = Requests::MASTER_ID;
                    $request->save();

                    $status = Yii::$app->mailer->compose()
                        ->setFrom(Yii::$app->system->get('email'))
                        ->setTo('sankras.pro@yandex.ru')
                        ->setSubject('Выезд мастера')
                        ->setHtmlBody('Заявка на вызов мастера.<br>Имя: ' . $masterName .'<br>Телефон: ' . $masterPhone)
                        ->send();

                    return [
                        'status' => $status,
                    ];
                }
            }


        }
        $date_card_from = (new \DateTime())->modify('-1 month')->format('m.Y');
        $date_card_to = (new \DateTime())->modify('+1 month')->format('m.Y');

        return $this->render('index', [
            'letter' => $form,
            'seoBottom' => $seoBottom,
            'date_card_from' => $date_card_from,
            'date_card_to' => $date_card_to
        ]);
    }

    public function actionContacts() {
        $this->view->registerLinkTag(['rel' => 'canonical', 'href' => Url::to(['/contacts'], true)]);
        $this->view->registerJsFile('/js/map.js?r2', ['position' => View::POS_HEAD]);
        $form = new WriteUsForm();

        if (Yii::$app->request->isAjax) {
            Yii::$app->response->format = Response::FORMAT_JSON;
            $validate = ActiveForm::validate($form);
            if ($validate) {
                $writeName = trim(Html::encode(Yii::$app->request->post('writeUsName')));
                $writePhone = trim(Html::encode(Yii::$app->request->post('writeUsPhone')));
                $writeEmail = trim(Html::encode(Yii::$app->request->post('writeUsEmail')));
                $writeMessage = trim(Html::encode(Yii::$app->request->post('writeUsMessage')));

                $request = new Requests();
                $request->name = $writeName;
                $request->phone = $writePhone;
                $request->email = $writeEmail;
                $request->text = $writeMessage;
                $request->type_id = Requests::WRITE_ID;
                $request->save();

                $validate = Yii::$app->mailer->compose()
                    ->setFrom($writeEmail)
                    ->setTo('sankras.pro@yandex.ru')
                    ->setSubject('Сообщение со страницы "Контакты"')
                    ->setHtmlBody('Имя: ' . $writeName . '<br>Телефон: ' . $writePhone . '<br>Email: ' . $writeEmail . '<br>Сообщение: ' . $writeMessage)
                    ->send();

                return [
                    'status' => $validate
                ];
            }
        }
        return $this->render('contacts', [
            'write' => $form
        ]);
    }

//    public function actionRates() {
//        return $this->render('rates', [
//        ]);
//    }

    public function actionFlat() {
        $this->view->registerLinkTag(['rel' => 'canonical', 'href' => Url::to(['/flat'], true)]);
        $form = new BaseForm();

        if (Yii::$app->request->isAjax) {
            Yii::$app->response->format = Response::FORMAT_JSON;
            $validate = ActiveForm::validate($form);
            if ($validate) {
                $status = false;
                $request = new Requests();

                $questionName = trim(Html::encode(Yii::$app->request->post('questionName')));
                $questionPhone = trim(Html::encode(Yii::$app->request->post('questionPhone')));
                $questionText = trim(Html::encode(Yii::$app->request->post('questionText')));

                $request->name = $questionName;
                $request->phone = $questionPhone;
                $request->text = $questionText;
                $request->type_id = Requests::QUESTION_ID;
                $request->save();

                $status = Yii::$app->mailer->compose()
                    ->setFrom(Yii::$app->system->get('email'))
                    ->setTo('sankras.pro@yandex.ru')
                    ->setSubject('Вопрос мастеру')
                    ->setHtmlBody('Вопрос мастеру.<br><b>Имя:</b> ' . $questionName .'<br><b>Телефон:</b> ' . $questionPhone . '<br><b>Вопрос:</b> ' . $questionText)
                    ->send();

                return [
                    'status' => $status,
                ];
            }
        }

        return $this->render('flat', [
            'question' => $form
        ]);
    }

    public function actionHouse() {
        $this->view->registerLinkTag(['rel' => 'canonical', 'href' => Url::to(['/house'], true)]);
        $form = new BaseForm();

        return $this->render('house', [
            'question' => $form
        ]);
    }

    public function actionCompany() {
        $this->view->registerLinkTag(['rel' => 'canonical', 'href' => Url::to(['/company'], true)]);
        $form = new BaseForm();

        if (Yii::$app->request->isAjax) {
            Yii::$app->response->format = Response::FORMAT_JSON;
            $validate = ActiveForm::validate($form);
            if ($validate) {
                $status = false;
                $request = new Requests();

                $questionName = trim(Html::encode($form->name));
                $questionPhone = trim(Html::encode($form->phone));
                $questionText = trim(Html::encode($form->text));

                $request->name = $questionName;
                $request->phone = $questionPhone;
                $request->text = $questionText;
                $request->type_id = Requests::QUESTION_ID;
                $request->save();

                $status = Yii::$app->mailer->compose()
                    ->setFrom(Yii::$app->system->get('email'))
                    ->setTo('sankras.pro@yandex.ru')
                    ->setSubject('Вопрос мастеру')
                    ->setHtmlBody('Вопрос мастеру.<br><b>Имя:</b> ' . $questionName .'<br><b>Телефон:</b> ' . $questionPhone . '<br><b>Вопрос:</b> ' . $questionText)
                    ->send();

                return [
                    'status' => $status,
                ];
            }
        }

        return $this->render('company', [
            'question' => $form
        ]);
    }

    public function actionPrivacyPolicy() {
        $this->view->registerMetaTag([
            'name' => 'robots',
            'content' => 'noindex, follow'
        ]);
        $date_from = (new \DateTime())->modify('-1 month')->format('m.Y');

        return $this->render('privacy-policy', [
            'date_from' => $date_from
        ]);
    }

}
