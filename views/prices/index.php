<?php
$this->title = 'Прайс-лист | Цены на монтаж санфаянса, водоснабжения, отопления';
$this->registerMetaTag([
    'name' => 'description',
    'content' => 'Стоимость выполнения монтажных работ по сантехнике'
]);
$this->registerMetaTag([
    'name' => 'keywords',
    'content' => 'прайс лист сантехнические работы, цены сантехнические работы, расценки сантехнические работы, стоимость сантехнические работы'
]);
?>
<section class="price" id="price">
    <div class="width">
        <div class="tabs">
            <ul>
                <li class="exo asphalt active"><a href="<?php echo Yii::$app->urlManager->createUrl('prices'); ?>">Прайс-лист</a></li>
                <li class="exo asphalt calc"><a href="/prices#calc">Рассчитать стоимость</a></li>
                <li class="exo asphalt" ><a href="<?php echo Yii::$app->urlManager->createUrl('prices/rates'); ?>">Пакеты услуг</a></li>
            </ul>
        </div>
        <section class="price-list clear">
            <h1 class="exo asphalt">Стоимость выполнения монтажных работ (прайс-лист <?php echo Yii::$app->formatter->asDate(time(), 'yyyy г.'); ?>)</h1>
            <div class="table">
                <?php $cat = []; ?>
                <?php foreach($prices as $price) { ?>
                    <table id="<?php echo $price['link']; ?>">
                        <?php echo '<caption class="exo">' . $price['title'] . '</caption>' ; ?>
                        <?php foreach ($price['sub'] as $group) { ?>
                            <?php echo '<tr id="'. $group['link'] . '" class="sub-title"><td>' . $group['title'] . '</td><td>Ед.</td><td class="hidden">Кол-во</td><td class="hidden">Цена</td><td class="table-cost">Стоимость</td></tr>'; ?>
                            <?php foreach ($group['sub'] as $item) {?>
                                <tr class="transition">
                                    <td><?php echo $item['title']; ?></td>
                                    <td class="table-unit"><?php echo $item['unit']; ?></td>
                                    <td data-id="<?php echo $item['price_id'];?>" class="table-number hidden"><input class="transition" value="0"></td>
                                    <td class="table-price"><?php echo $item['price']; ?></td>
                                    <td class="table-cost hidden">0</td>
                                </tr>
                            <?php } ?>
                        <?php } ?>
                    </table>
                <?php } ?>
                <div class="sum">
                    <a target="_blank" href="<?php echo Yii::$app->urlManager->createUrl('prices/print'); ?>" class="print exo">Распечатать</a>
                    <div class="reset exo pulse">Очистить всё</div>
                    <div class="result">Итого ориентировочная стоимость работ: <span class="res">0</span><span> руб.</span></div>
                </div>
            </div>
            <div class="nav-menu">
                <ul><?php foreach ($pricesCat as $cats) { ?>
                    <li><a class="asphalt transition" href="#<?php echo $cats['link']; ?>"><?php echo $cats['title']; ?></a><ul>
                        <?php foreach ($cats['sub'] as $cat) { ?>
                                <li><a class="asphalt transition" href="#<?php echo $cat['link']; ?>"><?php echo $cat['title']; ?></a></li>
                        <?php } ?></ul></li>
                    <?php } ?>
                </ul>
                <div class="up exo">Наверх</div>
            </div>
            <div class="table-description">
                <ul>
                    <li>Цены, указанные в прайсе, являются ориентировочными, возможно их изменение в зависимости от сложности работ. Мы всегда готовы рассмотреть ваши предложения, пойти навстречу и подобрать оптимальное решение по соотношению цены и качества.</li>
                    <li>Цены на сантехнические работы не включают в себя материалы. Мы предоставляем услуги по закупке и бесплатной доставке материала.</li>
                    <li>На все сантехнические работы действует гарантия, срок которой зависит от качества используемых материалов. Длительность гарантии варьируется от 1 года до 5 лет.</li>
                    <li>По всем возникшим вопросам вы всегда можете обратиться за консультацией к нашим мастерам по телефону <?php echo Yii::$app->system->get('phone'); ?></li>
                </ul>
            </div>
        </section>
    </div>
</section>
<script type="text/javascript">
    $('.price .nav-menu > ul > li:first-of-type, .price .table table:first-of-type').addClass('active');
</script>
<script type="text/javascript">
    $(document).ready(function() {
        $(document).scroll(function() {
            sumPosition();
            buttonUp();
        });
    });
</script>