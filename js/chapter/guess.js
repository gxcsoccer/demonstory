
define([
    'mo/lang',
    'dollar',
    'eventmaster',
    'choreo',
    'movie/util',
    'movie/camera',
    'movie/demon'
], function(_, $, event, choreo, util, camera, demon) {

    var wait = util.wait,

        DESC = '本节目由豆瓣广播，豆瓣读书，豆瓣电影，豆瓣音乐，豆瓣同城，豆瓣阅读，豆瓣小组，豆瓣 FM 及 更多 赞助播出。豆瓣电影，让好座位来找你；豆瓣FM，与好音乐期而遇；豆瓣阅读，带来雪意与五点钟。好条目由 fili 鼎力呈现，上 fili ， 与 502 不期而遇……',

        JUDGE_LIST = [
            { name: '卤十三', id: 'lu13' },
            { name: '田佳芝', id: 'yingzi' },
            { name: 'su37', id: 'su37' },
            { name: '老卡', id: 'laoka' }
        ];

    function initJudges(win, sfx) {
        var doc = win.document,
            judges = {},
            materials = $('#materials', doc);

        materials.show();

        JUDGE_LIST.forEach(function(item) {
            var dom = $('#judge-' + item.id, doc),
                demonItem = demon({
                    origin: dom,
                    className: 'demon-' + item.id,
                    window: win
                });

            demonItem.showBody().showHands().showLegs();

            judges[item.id] = {
                name: item.name,
                dom: dom,
                demon: demonItem
            };

            //demonItem.preview_mode = true;
        });

        materials.hide();

        return judges;
    }

    return {

        sfx: {
            intro: 'guess/intro.mp3',
            curtain: 'guess/curtain-long.mp3',
            walking: 'guess/walking.mp3',
            opening: 'guess/opening.mp3',
            exiting: 'guess/exiting.mp3',
            click: 'guess/click.mp3',
            'piggy/intro': 'guess/piggy/1.mp3',
            'piggy/mubu': 'guess/piggy/mubu.mp3',
            'piggy/boo': 'guess/piggy/boo.mp3',
            'piggy/clap': 'guess/piggy/clap.mp3',
            'piggy/push': 'guess/piggy/goaway.mp3',
            'piggy/intro-lu13': 'guess/piggy/2lu13.mp3',
            'piggy/intro-yingzi': 'guess/piggy/3yingzi.mp3',
            'piggy/intro-su37': 'guess/piggy/4su37.mp3',
            'piggy/police': 'guess/piggy/police.mp3',
            'piggy/section-1': 'guess/piggy/7yidaizongshi.mp3',
            'piggy/section-2': 'guess/piggy/8normal-fm.mp3',
            'piggy/section-3': 'guess/piggy/9xiangce.mp3',
            'piggy/section-4': 'guess/piggy/10xiayiwei.mp3',
            'piggy/section-4-1': 'guess/piggy/11houtai.mp3',
            'piggy/section-5': 'guess/piggy/12riji.mp3',
            'piggy/section-6': 'guess/piggy/13lichengpeng.mp3',
            'piggy/end': 'guess/piggy/14run.mp3',
            'piggy/abei': 'guess/piggy/abei.mp3',
            'piggy/zhangsheng': 'guess/piggy/zhangsheng.mp3',
            'lu13/intro': 'guess/lu13/dajiu.mp3',
            'lu13/intro-1': 'guess/lu13/2he1.mp3',
            'lu13/section-1': 'guess/lu13/3zongshi.mp3',
            'lu13/section-2': 'guess/lu13/4he-fm.mp3',
            'lu13/section-2-1': 'guess/lu13/5he-pro-fm.mp3',
            'lu13/section-4': 'guess/lu13/6mao.mp3',
            'lu13/section-mao': 'guess/lu13/7he-mao.mp3',
            'lu13/section-5': 'guess/lu13/8he-riji.mp3',
            'yingzi/intro': 'guess/yingzi/1.mp3',
            'yingzi/section-1': 'guess/yingzi/2zongshi.mp3',
            'yingzi/section-3': 'guess/yingzi/3xiangce.mp3',
            'yingzi/section-4': 'guess/yingzi/4he-mao.mp3',
            'su37/intro': 'guess/su37/1.mp3',
            'su37/intro-1': 'guess/su37/2.mp3',
            'su37/section-1': 'guess/su37/3zongshi.mp3',
            'su37/section-2': 'guess/su37/4fm-ad.mp3',
            'su37/section-3': 'guess/su37/5xiangce.mp3',
            'su37/section-3-1': 'guess/su37/5xiangce-2.mp3',
            'su37/section-5': 'guess/su37/6riji.mp3',
            'su37/section-6': 'guess/su37/7paolu.mp3',
            'ka/section-6-1': 'guess/ka/1.mp3',
            'ka/section-6-2': 'guess/ka/2.mp3',
            'fm/fm_normal': 'guess/fm/fm_normal.mp3',
            'fm/fm_ad': 'guess/fm/fm_ad.mp3',
            'fm/fm_pro': 'guess/fm/fm_pro.mp3',
            'li/zuguo': 'guess/lichengpeng/zuguo.mp3',
            'li/cuhua': 'guess/lichengpeng/cuhua.mp3',
            'li/shengren': 'guess/lichengpeng/shengren.mp3',
            'xiangce/bg': 'guess/xiangce/bg.mp3',
            'yidai': 'guess/yidai.mp3'
        },

        announce: function(screen, sfx) {

            return screen('“豆瓣好条目”——我要上首页', DESC, 15000, sfx.curtain);

        },

        main: function(win, promise, sfx) {
            var doc = win.document,
                screen = camera(win),
                piggy = $('#host-piggy', doc),
                piggyPromise = new event.Promise(),
                piggyDemon,
                materials = $('#materials', doc),
                sectionDemons = {},
                judges = initJudges(win, sfx),
                viewportWidth = win.innerWidth;

            piggyPromise.done(function() {

                materials.show();

                piggy.css({
                    position: 'fixed',
                    top: ($(window).height() - 96) / 2 + 'px',
                    right: -96 + 'px'
                });

                piggyDemon = demon({
                    origin: piggy,
                    className: 'demon-piggy',
                    window: win
                });

                piggyDemon.sound(sfx['piggy/mubu'],5000,70);

                materials.hide();

                piggyDemon.showBody().showHands().showLegs();

                return wait(200);

            }).follow().done(function() {

                piggyDemon.walk([ -160, 0 ], 1200);

                return wait(1200);

            }).follow().done(function() {

                piggyDemon.rotateHand('left', '130deg', 300);

                piggyDemon.speak('大家好，我是今天“我要上首页”的主持人，猪头小秘书！', 12000, 9, sfx['piggy/intro']);

                piggyDemon.rotateHand('right', '-130deg', 500);

                return wait(6000 + 300);

            }).follow().done(function() {

                piggyDemon.rotateHand('left', '170deg', 200);

                piggyDemon.speak('旧的不去，新的不来，今儿我们启用全新的大舞台！', 4000, 9);

                return wait(4200);

            }).follow().done(function() {

                var action = choreo().play();

                piggyDemon.rotateHand('left', '130deg', 500, 'easeIn');
                piggyDemon.sound(sfx['piggy/push'],2000,100);

                wait(1000).done(function(){
                    piggyDemon.sound(sfx['piggy/boo'], 4000, 70);
                });

                action.actor($('#wrapper', doc)[0], {
                    transform: 'translateX(-1500px)'
                }, 1000, 'easeInOut').follow().done(function() {

                    var wrapper = $('#wrapper', doc);

                    wrapper
                        .attr('style', '')
                        .css('opacity', 0)
                        .html('');

                    materials.show();

                    $('.wyssy-item-con', materials).each(function() {
                        var dom = $(this),
                            index = dom.data('section'),
                            sectionDemon;

                        dom.css('visibility', 'hidden');

                        sectionDemon = demon({
                            origin: dom,
                            className: 'demon-section',
                            window: win
                        });

                        sectionDemon.showBody().showHands().showLegs();

                        sectionDemon.me.css({
                            left: -sectionDemon.me.width() - 20 + 'px',
                            top: '110px',
                            visibility: 'visible'
                        });

                        sectionDemons[index] = sectionDemon;
                    });

                    materials.hide();

                    var action = choreo().play();

                    action.actor(wrapper[0], {
                        opacity: 1
                    }, 300, 'easeInOut');

                });


                return wait(1500);

            }).follow().done(function() {

                piggyDemon.rotateHand('left', '20deg', 300, 'easeIn');
                piggyDemon.rotateHand('right', '-20deg', 500, 'easeIn');

                return wait(500);

            }).follow().done(function() {

                piggyDemon.walk([ -140, -100 ], 800, 'easeInOut');

                wait(800).done(function() {

                    piggyDemon.speak('来到现场的评委，第一位是兆维卤十三老湿，大家欢迎～', 6000, 12, sfx['piggy/intro-lu13']);

                });

                return wait(5500);

            }).follow().done(function() {
                piggyDemon.sound(sfx['piggy/zhangsheng'],5000,100);

                wait(700).done(function() {

                    var lu13 = judges['lu13'].demon;

                    lu13.rotateHand('right', '-60deg');
                    lu13.rotateHand('left', '-66deg');

                    lu13.walk([ 890, -10 ], 2500);

                    wait(2500 + 300).done(function() {

                        lu13.rotateHand('left', '140deg', 500);
                        lu13.rotateHand('right', '-130deg', 440);

                        wait(600).done(function() {

                            lu13.speak('他大舅他二舅都是他舅，高桌子低板凳都是木头，我是你十三爷。', 8000, 12, sfx['lu13/intro']);

                            wait(6500).done(function() {

                                lu13.rotateHand('left', '30deg', 300);
                                lu13.rotateHand('right', '-32deg', 240);
                                piggyDemon.sound(sfx['piggy/clap'],5000,100);

                            });

                        });

                    });

                });

                return wait(800 + 3200 + 8000);

            }).follow().done(function() {

                piggyDemon.speak('接下来是芙蓉镇田佳芝～～', 3000, 8, sfx['piggy/intro-yingzi']);

                wait(2000 + 200).done(function() {

                    var yingzi = judges['yingzi'].demon;

                    yingzi.walk([ 750, -14 ], 1500);
                    wait(1500 + 200).done(function() {

                        yingzi.speak('喜欢一切雅俗共赏、能刷新认识的电影…文艺你伤不起', 8000, 10, sfx['yingzi/intro']);
                        wait(7500).done(function(){
                            piggyDemon.sound(sfx['piggy/clap'],5000,100);
                        });

                    });

                });

                return wait(1500 + 10000);

            }).follow().done(function() {

                piggyDemon.speak('下一位是根本就没有 su37 ？？！！', 3000, 8, sfx['piggy/intro-su37']);

                wait(2000 + 200).done(function() {

                    var su37 = judges['su37'].demon;

                    su37.walk([ 500, -12 ], 1000);

                    wait(1300 + 200).done(function() {

                        su37.speak('为了方便大家记忆，从今年开始，以后每年我都是37岁，今后大家再也不用计算我多少岁啦，是不是好轻松的感觉！举手之劳，方便别人，方便自己，低碳环保，利国利民。', 14000, 12, sfx['su37/intro']);

                        wait(13500 + 200).done(function() {

                            su37.rotateHand('right', '-56deg', 200);
                            piggyDemon.sound(sfx['piggy/clap'],3000,100);

                            wait(1000 + 100).done(function() {

                                su37.speak('旁边两位靠这么近干嘛呀，激情四射呀！', 4000, 11, sfx['su37/intro-1']);

                                wait(3800).done(function() {

                                    var lu13 = judges['lu13'].demon,
                                        yingzi = judges['yingzi'].demon;

                                    lu13.speak('不行啊？！', 2000, 12, sfx['lu13/intro-1']);

                                    wait(300).done(function() {

                                        yingzi.speak('不行啊？！', 800, 10);

                                    });

                                    wait(2000 + 200).done(function() {

                                        su37.speak('。。。', 800, 1);
                                        su37.rotateHand('right', '-28deg', 200);

                                    });

                                });

                            });

                        });

                    });

                });

                return wait(3000 + 2000 + 14000 + 5000);

            })

            /* section#1 一代宗师 by lifei */
            .follow().done(function() {
                //fucking debug
                //return wait(0)

                var sectionDemon = sectionDemons[1],
                    su37 = judges['su37'].demon,
                    yingzi = judges['yingzi'].demon,
                    lu13 = judges['lu13'].demon,
                    sectionPromise = new event.Promise();

                piggyDemon.speak('欢迎第一位选手入场，饱受争议电影条目“一代宗师”！', 5000, 12, sfx['piggy/section-1']);

                sectionDemon.me.css('top', '140px');

                wait(4000).done(function() {
                    sectionDemon.sound(sfx['yidai'], 6000, 100);

                    sectionDemon.walk([ (viewportWidth - sectionDemon.me.width()) / 2 + sectionDemon.me.width(), 0 ], 2000);
                    wait(2000).done(function() {

                        lu13.speak('骚！', 1800, 12, sfx['lu13/section-1']);
                        return wait(2000);

                    }).follow().done(function() {

                        yingzi.speak('我。没。看。懂。这。个。武。术。家。出。轨。未。遂。的。片。子。呀。。。', 9000, 12, sfx['yingzi/section-1']);
                        return wait(9000);

                    }).follow().done(function() {

                        su37.speak('故事都讲不周全，还拍个啥电影？只会摆格调的话，应该去搞展览，比如”带墨镜的人”之类的主题展应该更适合他。', 14000, 12, sfx['su37/section-1']);
                        return wait(14000);

                    })
                    return wait(3000 + 2000 + 9000 + 11500);
                }).follow().done(function() {
                    sectionDemon.walk([ viewportWidth + sectionDemon.me.width() + 20, 30 ], 1500, 'easeIn');
                    sectionPromise.fire();
                });

                return sectionPromise;
            })
            /* end fo section#1 */

            /* section#2 FM by lifei */
            .follow().done(function() {
                //fucking debug
                //return wait(0);

                var proDemon = sectionDemons['fm-pro'],
                    normalDemon = sectionDemons['fm-normal'],
                    adDemon = sectionDemons['fm-ad'],
                    su37 = judges['su37'].demon,
                    yingzi = judges['yingzi'].demon,
                    lu13 = judges['lu13'].demon,
                    sectionPromise = new event.Promise();

                piggyDemon.speak('有请下一位选手入场，歌曲“Put Your Records On“', 4000, 12, sfx['piggy/section-2']);

                wait(4000 + 200).done(function() {
                    normalDemon.walk([ (viewportWidth - normalDemon.me.width()) / 2 + normalDemon.me.width(), 0 ], 5000);
                    normalDemon.sound(sfx['fm/fm_normal'], 7000, 100);

                    wait(6800).done(function() {

                        lu13.speak('才 64k，还不如广告音质好，不通过！', 5000, 3, sfx['lu13/section-2']);
                        su37.speak('才 64k，还不如广告音质好，不通过！', 5000, 10);
                        yingzi.speak('才 64k，还不如广告音质好，不通过！', 5000, 0);

                    });
                    return wait(10000);

                }).follow().done(function() {
                    normalDemon.walk([ viewportWidth + normalDemon.me.width() + 20, 30 ], 2000, 'easeIn');
                    normalDemon.speak('嘤嘤嘤嘤', 1000, 6);
                    return wait(2200);

                }).follow().done(function() {
                    adDemon.walk([ (viewportWidth - adDemon.me.width()) / 2 + adDemon.me.width(), 0 ], 2000);
                    adDemon.sound(sfx['fm/fm_ad'], 8000, 100);
                    wait(4000).done(function() {

                        lu13.speak('说广告你还真来啊……', 1500, 10);
                        su37.speak('说广告你还真来啊……', 1500, 10);

                    });

                    return wait(6000);

                }).follow().done(function() {
                    proDemon.walk([ (viewportWidth - proDemon.me.width()) / 2 + proDemon.me.width(), 0 ], 7000);
                    proDemon.sound(sfx['fm/fm_pro'], 20000, 100);
                    wait(1500).done(function() {
                        proDemon.speak('Pro登场，广告还不速速退场！', 3000, 3);
                        adDemon.speak('灰溜溜地逃走', 1500, 5);
                        adDemon.walk([ viewportWidth + adDemon.me.width() + 20, 30 ], 1000, 'easeIn');
                        return wait(5000 + 200);
                    }).follow().done(function() {
                        proDemon.speak('更纯洁的音质，无广告的体验', 3500, 10);
                        lu13.speak('比刚才好多了', 3500, 3);
                        su37.speak('多亏我的Monster耳机！', 3500, 0);

                        return wait(10000);
                    }).follow().done(function() {
                        lu13.speak('高端大气上档次，通过！', 3500, 3, sfx['lu13/section-2-1']);
                        su37.speak('高端大气上档次，通过！', 3500, 10);
                        yingzi.speak('高端大气上档次，通过！', 3500, 0);
                    });

                    return wait(20000);
                }).follow().done(function() {
                    proDemon.walk([ viewportWidth + proDemon.me.width() + 20, 30 ], 2000, 'easeIn');
                    piggyDemon.sound(sfx['piggy/clap'],3000,100);
                    return wait(2000);

                }).follow().done(function() {
                    // section end
                    sectionPromise.fire();

                });
                return sectionPromise;

            })
            /* end fo section#2 */

            /* section#3 相册 by gonghao */
            .follow().done(function() {

                //fucking debug
                //return wait(0);

                var sectionDemon = sectionDemons[3],
                    su37 = judges['su37'].demon,
                    yingzi = judges['yingzi'].demon,
                    lu13 = judges['lu13'].demon,
                    sectionPromise = new event.Promise(),
                    bgAudio = sfx['xiangce/bg'];

                piggyDemon.speak('欢迎下一位选手入场，这位选手的名字叫『有容乃大』。。。', 6000, 12, sfx['piggy/section-3']);

                wait(6000 + 200).done(function() {

                    bgAudio.setVolume(20);
                    bgAudio.play();

                    sectionDemon.walk([ (viewportWidth - sectionDemon.me.width()) / 2 + sectionDemon.me.width(), 0 ], 8000);

                    wait(1500).done(function() {

                        su37.speak('远了点儿，走近了爷仔细看看', 4500, 12, sfx['su37/section-3']);

                        return wait(4800);

                    });

                    return wait(8000 + 200);

                }).follow().done(function() {

                    var action = choreo().play();

                    action.actor($('#db-global-nav', doc)[0], {
                        opacity: 0.5
                    }, 200);

                    action.actor($('#db-nav-sns', doc)[0], {
                        opacity: 0.5
                    }, 200);

                    wait(200).done(function() {

                        $('#pause', doc)
                            .css({
                                position: 'absolute',
                                top: '20px',
                                right: '20px'
                            })
                            .appendTo(doc.body);

                        bgAudio.pause();

                        return wait(500);

                    }).follow().done(function() {

                        screen.pan({
                            elem: $('.pic', sectionDemon.me),
                            zoom: 2,
                            offset: {
                                top: -60
                            },
                            duration: 800
                        });

                        return wait(800 + 500);

                    }).follow().done(function() {

                        var mouse = $('#mouse', doc)
                                .css({
                                    position: 'absolute',
                                    top: '170px',
                                    left: '290px',
                                    zIndex: '1'
                                }).appendTo(doc.body),

                            action = choreo().play();

                        action.actor(mouse[0], {
                            top: '170px',
                            left: '490px'
                        }, 500, 'easeOut');

                        wait(500 + 200).done(function() {
                            sectionDemon.sound(sfx['click'], 1000, 100);
                        });

                        return wait(500 + 200 + 500);

                    }).follow().done(function() {

                        var saveAs = $('#save-as', doc)
                                .css({
                                    position: 'absolute',
                                    top: '50px',
                                    left: '430px',
                                    opacity: 0
                                }).appendTo(doc.body),

                            action = choreo().play();

                        action.actor(saveAs[0], {
                            opacity: 1
                        }, 300, 'easeIn');

                        wait(300 + 200).done(function() {
                            sfx['click'].setTime(0);
                            sectionDemon.sound(sfx['click'], 1000, 100);
                        });

                        return wait(300 + 200 + 500);

                    }).follow().done(function() {

                        var saveAsDialog = $('#save-as-dlg', doc)
                                .css({
                                    position: 'absolute',
                                    top: '95px',
                                    left: '370px',
                                    opacity: 0
                                }).appendTo(doc.body),

                            action = choreo().play();

                        $('#mouse', doc).css('zIndex', 0);

                        action.actor(saveAsDialog[0], {
                            opacity: 1
                        }, 300, 'easeInOut');

                        return wait(300 + 800);

                    }).follow().done(function() {

                        var action = choreo().play(),
                            mouse = $('#mouse', doc);

                        mouse.css('zIndex', 1);

                        action.actor(mouse[0], {
                            top: '420px',
                            left: '750px'
                        }, 800, 'easeOut');

                        wait(800 + 200).done(function() {
                            sfx['click'].setTime(0);
                            sectionDemon.sound(sfx['click'], 1000, 100);
                        });

                        return wait(800 + 400 + 500);

                    }).follow().done(function() {

                        $('#mouse', doc).remove();
                        $('#save-as', doc).remove();

                        var saveAsDialog = $('#save-as-dlg', doc),
                            action = choreo().play();

                        action.actor(saveAsDialog[0], {
                            opacity: 0
                        }, 200, 'easeIn');

                        action.follow().done(function() {
                            saveAsDialog.remove();
                        });

                        return wait(200 + 300);

                    }).follow().done(function() {

                        screen.reset(500);

                        return wait(500 + 200);

                    }).follow().done(function() {

                        var action = choreo().play();

                        action.actor($('#pause', doc)[0], {
                            opacity: 0
                        }, 200, 'easeIn');

                        action.actor($('#db-global-nav', doc)[0], {
                            opacity: 1
                        }, 200);

                        action.actor($('#db-nav-sns', doc)[0], {
                            opacity: 1
                        }, 200);

                        action.follow().done(function() {
                            bgAudio.play();
                            $('#pause', doc).remove();
                        });

                        return wait(200 + 1000);

                    }).follow().done(function() {

                        $('#pause', doc).remove();

                        lu13.speak('不符合社区指导规则。。。嘿嘿嘿。', 4000, 12);
                        yingzi.speak('不符合社区指导规则。。。嘿嘿嘿。', 4000, 11);
                        su37.speak('不符合社区指导规则。。。嘿嘿嘿。', 4000, 12, sfx['su37/section-3-1']);

                        return wait(4000 + 200);

                    }).follow().done(function() {

                        var sectionDemon = sectionDemons[3];

                        sectionDemon.walk([ viewportWidth + sectionDemon.me.width() + 20, 30 ], 3000, 'easeIn')
                            .done(function() {
                                bgAudio.fadeOut(200);
                            });

                        return wait(3000 + 200);

                    }).follow().done(function() {

                        // section end
                        sectionPromise.fire();

                    });

                });

                return sectionPromise;

            })
            /* end fo section#3 */

            /* section#4 猫 by zhaoguo */
            //.follow().done(function() {

                ////fucking debug
                ////return wait(0);

                //var sectionDemon = sectionDemons[4],
                    //su37 = judges['su37'].demon,
                    //yingzi = judges['yingzi'].demon,
                    //lu13 = judges['lu13'].demon,
                    //sectionPromise = new event.Promise();

                //piggyDemon.speak('欢迎下一位选手', 2000, 12, sfx['piggy/section-4']);

                //wait(2000 + 200).done(function() {

                    //piggyDemon.sound(sfx['mao/in'],6000,70);
                    //sectionDemon.walk([ (viewportWidth - sectionDemon.me.width()) / 2 + sectionDemon.me.width(), 0 ], 3500);

                    //return wait(3500 + 400);

                //}).follow().done(function(){

                        //sectionDemon.speak('四大音乐剧之首，《猫》中文版可以在豆瓣购票了，喵~',7500,6, sfx['mao/section-4-1']);

                    //return wait(7500 + 200);

                //}).follow().done(function() {

                    //lu13.speak('保安呢，怎么回事，谁把票贩子放进来了，赶出去！', 6000, 12, sfx['lu13/section-4']);

                    //wait(6000).done(function(){

                        //yingzi.speak('赶出去！！！', 1500, 12, sfx['lu13/section-mao']);
                        //su37.speak('赶出去！！！', 1500, 12);
                    //});

                    //return wait(6000 + 300);

                //}).follow().done(function() {

                    //sectionDemon.speak('喵了个咪的，你们这些土了吧唧的XX，不知道我是内定的吗，白白了您内~',8000,6, sfx['mao/section-4-2']);

                    //wait(6500).done(function(){
                        //sectionDemon.walk([-( viewportWidth + sectionDemon.me.width() - 20), 30 ], 3000, 'easeIn');
                    //});

                    //return wait(7000 + 300);

                //}).follow().done(function() {

                    //piggyDemon.speak('好吧，有后台我们惹不起~~', 3000, 9, sfx['piggy/section-4-1']);
                    //lu13.speak('。。。。。。',900,12);
                    //su37.speak('。。。。。。',900,12);
                    //yingzi.speak('。。。。。。',900,12);

                    //return wait( 3000 + 300 );

                //}).follow().done(function() {

                    //// section end
                    //sectionPromise.fire();

                //});

                //return sectionPromise;

            //})
            /* end fo section#4 */

            /* section#5 阿北 by gonghao */
            .follow().done(function() {

                //fucking debug
                //return wait(0);

                var sectionDemon = sectionDemons[5],
                    su37 = judges['su37'].demon,
                    yingzi = judges['yingzi'].demon,
                    lu13 = judges['lu13'].demon,
                    sectionPromise = new event.Promise();

                piggyDemon.speak('有请下一位选手入场，这位选手是一篇日记的名字叫『21天精通精益创业』，大家欢迎！', 7000, 12, sfx['piggy/section-5']);

                sectionDemon.me.css('top', '140px');

                wait(4000 + 200).done(function() {

                    sectionDemon.walk([ (viewportWidth - sectionDemon.me.width()) / 2 + sectionDemon.me.width(), 0 ], 1000);

                    wait(1500).done(function() {

                        su37.speak('月『精』日记又出现了！', 4500, 12, sfx['su37/section-5']);
                        lu13.speak('想：月『精』日记又出现了！', 4000, 12);

                    });

                    return wait(6000 + 200);

                }).follow().done(function() {

                    screen.pan({
                        elem: $('.ahbei-like', sectionDemon.me),
                        zoom: 2.6,
                        duration: 800
                    });

                    return wait(800 + 500);

                }).follow().done(function() {

                    var ahbeiLike = $('.ahbei-like', sectionDemon.me),
                        shiningDuration = 400,
                        shiningTimes = 5,
                        i = 0;

                    ahbeiLike.css('color', 'red');

                    for (; i < shiningTimes; i++) {

                        var fn = (function(count) {
                            if (count % 2 === 0) {
                                return function() {
                                    ahbeiLike.attr('style', '');
                                };
                            }

                            return function() {
                                ahbeiLike.css('color', 'red');
                            };
                        })(i);

                        wait((shiningDuration + 1) * i).done(fn);
                    }
                    piggyDemon.sound(sfx['piggy/abei'],15000,100);

                    return wait((shiningDuration + 1) * shiningTimes + 300);

                }).follow().done(function() {

                    screen.reset(800);

                    return wait(800 + 200);

                }).follow().done(function() {

                    lu13.speak('通过！！！', 2000, 1, sfx['lu13/section-5']);
                    yingzi.speak('通过！！！', 2000, 11);
                    su37.speak('通过！！！', 2000, 12);

                    return wait(2000 + 200);

                }).follow().done(function() {

                    piggyDemon.sound(sfx['piggy/clap'],3000,100);
                    sectionDemon.walk([ viewportWidth + sectionDemon.me.width() + 20, 30 ], 3000, 'easeIn');

                    return wait(3000 + 200);

                }).follow().done(function() {

                    sectionPromise.fire();

                });

                return sectionPromise;

            })
            /* end fo section#5 */

            /* section#6 拖黑 by zhaoguo */
            .follow().done(function() {

                var sectionDemon = sectionDemons[6],
                    su37 = judges['su37'].demon,
                    yingzi = judges['yingzi'].demon,
                    lu13 = judges['lu13'].demon,
                    laoka = judges['laoka'].demon,
                    sectionPromise = new event.Promise();

                piggyDemon.speak('下一位看起来很有文化的样子嘛，欢迎~', 4000, 9, sfx['piggy/section-6']);

                wait(2000 + 200).done(function() {

                    sectionDemon.walk([ (viewportWidth - sectionDemon.me.width()) / 2 + sectionDemon.me.width(), 0 ], 2000);
                    piggyDemon.sound(sfx['li/cuhua'], 6000, 70);

                    return wait(1500 + 400);

                }).follow().done(function(){

                    sectionDemon.speak('一个人的粗话，却有可能是另一个人的抒情诗。这是表达的尊严。', 4000 , 6 , sfx['li/cuhua']);
                    lu13.speak('CA。。。。。',3100,3);

                    wait(4000 + 100).done(function(){

                        sectionDemon.speak('我从不是圣人，而是一名不断努力的罪人', 4000 , 6 , sfx['li/shengren']);

                        su37.speak('装X遭雷劈',3000,12);
                        yingzi.speak('Zzzzzz.....',3000,12);

                    });

                    return wait(2000 + 4000 + 400);

                }).follow().done(function(){

                    sectionDemon.sound(sfx['exiting'], 10000, 100);
                    laoka.walk([ 300, -180 ], 900);
                    laoka.rotateHand('right', '-90deg', 300);
                    laoka.sound(sfx['ka/section-6-1'],9000,100);

                    wait(1500).done(function(){
                        laoka.speak('干嘛呢，干嘛呢，非法集会，还讨论敏感话题，通通别动！', 9000, 3);
                    });
                    wait(3500).done(function(){
                        su37.walk([-300,0],8000);
                    });

                    return wait( 1500 + 7000 + 400);

                }).follow().done(function(){

                    lu13.walk([1000,-200],1200);
                    lu13.speak('撤！！！',800,12);

                    su37.speak('靠！！！',2000,12);
                    su37.sound(sfx['su37/section-6'],2000,100);
                    su37.walk([-1000,-100],500);

                    yingzi.walk([-2100,50],1200);
                    yingzi.speak('匿了',800,12);

                    sectionDemon.walk([2000,-200],1200);
                    lu13.speak('又有砸场的？？？',800,12);
                    piggyDemon.sound(sfx['piggy/end'],2500,100);

                    wait(1000).done(function(){

                        piggyDemon.speak('不要丢下我啊~~~~', 800, 11);
                        piggyDemon.walk([-400,0],1000);

                        wait(1000).done(function(){
                            piggyDemon.walk([2000,0],1500);
                            piggyDemon.speak('救命~~~~~', 800, 9);
                        });

                    });

                    return wait(2000 + 500);

                }).follow().done(function(){

                    laoka.walk([400,-50],2000);
                    laoka.sound(sfx['ka/section-6-2'],6000,100);
                    piggyDemon.sound(sfx['piggy/police'],15000,65);
                    wait(2000 + 200).done(function(){
                        laoka.speak('哼哼，这下知道首页是谁的了吧！！！',4000, 6);
                    });
                    wait(5000+300).done(function(){
                        laoka.walk([2400,-50],6000);
                    });

                    wait(8000).done(function(){
                        $('#wrapper',doc).append('<div id="end-form">\
                                纯属虚构 如有雷同<br> \
                                那是故意\
                            </div>');
                        $('#end-form',doc).css({
                            'text-align':'center'
                            ,'font-size':'40px'
                            ,'margin-top':'200px'
                        });
                    });

                    return wait(12000);

                }).follow().done(function() {

                    // section end
                    sectionPromise.fire();

                });

                return sectionPromise;

            })
            /* end fo section#6 */

            // the end
            .follow().done(function() {
                promise.fire();
            });

            // ready for start
            piggyPromise.fire();

            return promise;

        },

        reset: function() {}

    };

});
