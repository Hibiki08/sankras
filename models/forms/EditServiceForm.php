<?php

namespace app\models\forms;

use app\models\Services;
use app\models\Video;
use Yii;
use yii\base\Model;
use app\components\Translate;


class EditServiceForm extends Model {

    public $title;
    public $title_menu;
    public $link;
    public $parent_id;
    public $form_title;
    public $tag_title;
    public $tag_keywords;
    public $tag_description;
    public $prev_field;
    public $gallery_title;
    public $main_text;
    public $work_text;
    public $price_title;
    public $table_ex;
    public $package_ex;
    public $packages;
    public $image;
    public $slides;
    public $slide_text;
    public $slide_description;
    public $projectdocs;
    public $projectdocs_name;
    public $projectdocs_description;
    public $projectdocs_sort;
    public $video;
    public $blockVideoUrl;
    public $blockVideoTitle;
    public $blockVideoDescription;
    public $blockVideo;
    public $videos_name;
    public $videos_show;
    public $img_video;
    public $benefits;
    public $sort;
    public $active;
    public $old_attribute_val = '';
    public $projectdocs_active;
    public $projectdocs_title;

    public $googleSheet;
    public $showGoogleSheet;

    const SCENARIO_ADD_VIDEO = 'add-video';
    const SCENARIO_SERVICE = 'service';

    public function rules() {
        return [
            ['link', 'unique', 'targetClass' => Services::className(), 'message' =>  'Такой путь уже есть', 'when' => function ($form, $attribute) {
                return $this->$attribute !== $this->old_attribute_val;
            },],
            [['title', 'link', 'parent_id', 'form_title', 'tag_title', 'tag_keywords',
                'tag_description', 'prev_field', 'gallery_title', 'main_text',
                'price_title', 'img_video', 'title_menu'], 'required'],
            [['image'], 'file', 'extensions' => ['jpg', 'jpeg', 'gif', 'png', 'webp'], 'skipOnEmpty' => true],
            [['slides'], 'file', 'extensions' => ['jpg', 'jpeg', 'gif', 'png', 'webp'], 'maxFiles' => 10, 'skipOnEmpty' => true],
            [['projectdocs'], 'file', 'extensions' => ['jpg', 'jpeg', 'gif', 'png', 'webp'], 'maxFiles' => 10, 'skipOnEmpty' => true],
            [['title', 'link', 'form_title', 'tag_title', 'tag_keywords', 'tag_description',
                'gallery_title', 'price_title', 'image', 'video'], 'string', 'max' => 255],
            ['video', 'match', 'pattern' => '/youtube.com\/embed/i'],
            ['prev_field', 'string'],
            [['main_text', 'work_text', 'packages'], 'string'],
            [['title', 'link', 'parent_id', 'form_title', 'tag_title', 'tag_keywords',
                'tag_description', 'prev_field', 'gallery_title', 'main_text',
                'price_title', 'projectdocs_title', 'img_video', 'main_text', 'work_text', 'packages'], 'filter','filter'=>'trim'],
            [['sort'], 'integer'],
            [['blockVideoUrl', 'blockVideoTitle'], 'required', 'on' => self::SCENARIO_ADD_VIDEO],
            [['blockVideoDescription'], 'safe', 'on' => self::SCENARIO_ADD_VIDEO],
            [['blockVideoUrl'], 'match', 'pattern' => '/^https:\/\/youtu.be\/(.+)/i'],
            [['blockVideo', 'videos_show', 'showGoogleSheet'], 'safe'],
            [['googleSheet'],
                'match',
                'pattern' => '/https:\/\/docs.google.com\/spreadsheets\/d\/e\/(.+)\/pubhtml\?(.+)/i'
            ],
        ];
    }

    public function scenarios() {
        $scenarios = parent::scenarios();
        $scenarios[self::SCENARIO_ADD_VIDEO] = ['blockVideoUrl', 'blockVideoTitle', 'blockVideoDescription'];
        $scenarios[self::SCENARIO_SERVICE] = $this->getAttributes(
            $this->attributes(),
            $scenarios[self::SCENARIO_ADD_VIDEO]
        );
        return $scenarios;
    }

    public function setOldAttribute($value) {
        return $this->old_attribute_val = $value;
    }

    public function upload($path, $image) {
        if (isset($image->name) && !is_null($image->name)) {
            $translate = new Translate();
            $image->name = $translate->translate($image->name);
            if ($image->saveAs(Yii::$app->basePath . '/web' . Yii::$app->params['params']['pathToImage'] . $path . $image->name)) {
                return true;
            }
        }
        return false;
    }

    public function attributeLabels() {
        return [
            'title' => 'Заголовок страницы',
            'title_menu' => 'Заголовок меню',
            'link' => 'Ссылка на страницу',
            'parent_id' => 'Родительская страница',
            'form_title' => 'Заголовок формы',
            'tag_title' => 'Тег title',
            'tag_keywords' => 'Keywords',
            'tag_description' => 'Description',
            'prev_field' => 'Поле с коротким текстом',
            'gallery_title' => 'Заголовок галереи',
            'main_text' => 'Основной текст',
            'work_text' => 'Список фирм',
            'price_title' => 'Заголовок блока с ценами',
            'table_ex' => 'Отображение таблицы',
            'package_ex' => 'Отображение пакетов',
            'packages' => 'Пакеты',
            'image' => 'Главная картинка',
            'slides' => 'Слайды',
            'projectdocs' => 'Проектная документация',
            'video' => 'Видео',
            'img_video' => 'Картинка или видео',
            'benefits' => 'Отображение блока с выгодами',
            'sort' => 'Сортировка',
            'active' => 'Активность',
            'videos_show' => 'Отображать блок видеозаписей',
            'blockVideoUrl' => 'Ссылка на видео',
            'blockVideoTitle' => 'Название видео',
            'blockVideoDescription' => 'Описание видео',
            'videos_name' => 'Описание видео',
            'projectdocs_title' => 'Заголовок проектной документации',
            'projectdocs_active' => 'Отображение проектной документации'
        ];
    }
}