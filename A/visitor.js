(function () {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var url = window.location.search.substr(1);
        var r = url.match(reg);
        return r ? decodeURIComponent(r[2]) : null;
    }

    function fSetUrlParam(url){
        var ParamArry=['r','p','mt','mi','msi'];
        for(var i=0;i<ParamArry.length;i++){
            var t=GetQueryString(ParamArry[i])||'';
            if(t){
                if(url.indexOf('?')>0){
                    url=url+'&'+ParamArry[i]+'='+t;
                }else{
                    url=url+'?'+ParamArry[i]+'='+t;
                }
            }
        }
        return url;
    }
    
    function AjaxAct(method, url, params, callback) {
        var xmlHttpReg = null;
        if (window.ActiveXObject) {
            xmlHttpReg = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            xmlHttpReg = new XMLHttpRequest();
        }
        if (xmlHttpReg != null) {
            xmlHttpReg.open(method, url, true);
            if (method == "POST") {
                xmlHttpReg.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
            xmlHttpReg.send(params);
            xmlHttpReg.onreadystatechange = doResult;
        }
        function doResult() {
            if (xmlHttpReg.readyState == 4) {
                if (xmlHttpReg.status == 200) {
                    callback(xmlHttpReg.responseText);
                }
            }
        }
    }

    //公共
    //var s = location.href.replace("https://", "").replace("http://", ""); //app参数

    //跳转处理
    var reg = new RegExp("\/([^(.&&\/)]+).html", "i");
    var actGet = GetQueryString("ui");
    //获取代理参数
    var proxypram = GetQueryString("z");
    //短链参数
    var shortUrl = GetQueryString("t");
    //测试模式
    var testType = GetQueryString("tT");

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    //请求Ui的地址前缀
    // var UiPostUrl="http://mhpqruocwl.cn";
    var UiPostUrl = "//rescdn.sitezt.cn";

    var actPostUrl;
    //var CmsName;

    // CmsName={
    //     1:'home',
    //     2:'detail',
    //     3:'dan',
    //     4:'search',
    //     5:'xsqg',
    //     6:'dan',//9k9
    //     7:'dan',//tqg
    //     8:'dan',//jhs
    //     9:'dan',//pp
    //     10:'dan',//xbjx
    //     11:'dan',//crqb
    //     12:'dan',//leimu

    //     51:'bksp',
    //     52:'YanxList',
    //     53:'Zcdetail',
    //     54:'Zclist',
    //     55:'download',
    //     56:'downloadnew',
    //     57:'mrcj',
    //     58:'reqester',
    //     59:'sharedetail',
    //     60:'xsqg',
    //     61:'zb',
    //     62:'zcshare'
    // }

    // //对actGet参数 旧数据的兼容
    // if(actGet&&actGet.indexOf('%3A%2F%2F')>0){
    //     actGet=actGet.match(reg)[1];
    // }


    if (!actGet) {
        if (shortUrl) {
            //短链进入 链接待改
            AjaxAct("POST", "http://app.sitezt.cn/api/longlink", "ShortLink=" + shortUrl, function (A) {
                var json = A;
                if (typeof (json) == "string") {
                    json = JSON.parse(json);
                }
                var TrueUrl = json.Url;
                var CurUrl = location.href;
                var JumpUrl = TrueUrl.replace(TrueUrl.substring(0, TrueUrl.indexOf("?")), CurUrl.substring(0, CurUrl.indexOf("?")));
                location.href = JumpUrl;
            });
        } else {
            //不带ui参数跳转到首页
            if (location.href.indexOf("?") > -1) {
                var domain = location.href.substring(0, location.href.indexOf("?"));
            } else {
                var domain = location.href;
            }

            var redirectionUrl = domain + "?ui=home";
            redirectionUrl=fSetUrlParam(redirectionUrl);
            location.href = redirectionUrl;
            return false;
        }
    } else {
        if (actGet.indexOf('a_') == 0||(actGet.indexOf('.html')>-1&&actGet.indexOf('.html') === actGet.length-5)) {
            //appH5

            if(actGet.indexOf('a_') == 0){
                //最外页
                actGet = actGet.substring(2, actGet.length)
                var actPostUrl = UiPostUrl + '/' + actGet + '.html';
            }else{
                //活动页
                var actPostUrl = UiPostUrl + '/A/' + actGet;
            }

            if (window.hasOwnProperty("zutuanApp")) {
                //在App中
                AjaxAct("GET", actPostUrl, "", function (A) {
                    document.write(A);
                });
            } else {
                if (!isAndroid && !isiOS) {
                    AjaxAct("GET", actPostUrl, "", function (A) {
                        document.write(A);
                    });
                } else {
                    var s = location.href.replace("https://", "").replace("http://", ""); //app参数
                    if (actGet == 'mrcj.html') {
                        window.location.href = 'mg://web?action=toLuckyDraw&data={\"webUrl\":\"' + s + '\"}';
                    } else if (actGet == 'zcshare') {
                        var zcid = GetQueryString('zcid') || 0;
                        window.location.href = 'mg://web?action=toZC&data={\"zcId\":\"' + zcid + '\"}';
                    } else {
                        window.location.href = "meiguang://" + s;
                    }
                    setTimeout(function () {
                        AjaxAct("GET", actPostUrl, "", function (A) {
                            document.write(A);
                        });
                    }, 1000);
                }
            }
        } else {
            var RoadPath = '';
            //确定路径
            if (!isAndroid && !isiOS) {
                if (testType) {
                    RoadPath = 'pTest';
                } else {
                    RoadPath = 'p';
                }
            } else {
                if (testType) {
                    RoadPath = 'mTest';
                } else {
                    RoadPath = 'm';
                }
            }
            if (actGet.indexOf('d_') == 0) {
                actGet = "dan";
            }
            //请求地址
            var actPostUrl = UiPostUrl + '/A/c/' + RoadPath + '/' + actGet + '.html';
            //请求页面
            AjaxAct("GET", actPostUrl, "", function (A) {
                document.write(A);
            });
        }

        // if (actGet == "home" || actGet == "detail" || actGet == "search" || actGet == "xsqg" || actGet == "9k9" || actGet == "tqg" || actGet == "jhs" || actGet == "pp" || actGet == "xbjx" || actGet == "crqb" || actGet == "leimu") {
        //     //cms
        //     var RoadPath = '';
        //     //确定路径
        //     if (!isAndroid && !isiOS) {
        //         if (testType) {
        //             RoadPath = 'PCTest';
        //         } else {
        //             RoadPath = 'PC';
        //         }
        //     } else {
        //         if (testType) {
        //             RoadPath = 'PHTest';
        //         } else {
        //             RoadPath = 'PH';
        //         }
        //     }
        //     if (actGet == "9k9" || actGet == "tqg" || actGet == "jhs" || actGet == "pp" || actGet == "xbjx" || actGet == "crqb" || actGet == "leimu") {
        //         actGet = "dan";
        //     }
        //     //请求地址
        //     var actPostUrl = UiPostUrl + '/AllH5/CmsNew/' + RoadPath + '/ui/' + actGet + '.html';
        //     //请求页面
        //     AjaxAct("GET", actPostUrl, "", function (A) {
        //         document.write(A);
        //     });
        // } else {
        //     //appH5
        //     var actPostUrl = UiPostUrl + '/AllH5/AppCms/UI/' + actGet + '.html';

        //     if (window.hasOwnProperty("zutuanApp")) {
        //         //在App中
        //         AjaxAct("GET", actPostUrl, "", function (A) {
        //             document.write(A);
        //         });
        //     } else {
        //         if (!isAndroid && !isiOS) {
        //             AjaxAct("GET", actPostUrl, "", function (A) {
        //                 document.write(A);
        //             });
        //         } else {
        //             var s = location.href.replace("https://", "").replace("http://", ""); //app参数
        //             if (actGet == 'mrcj') {
        //                 window.location.href = 'mg://web?action=toLuckyDraw&data={\"webUrl\":\"' + s + '\"}';
        //             } else if (actGet == 'zcshare') {
        //                 var zcid = GetQueryString('zcid') || 0;
        //                 window.location.href = 'mg://web?action=toZC&data={\"zcId\":\"' + zcid + '\"}';
        //             } else {
        //                 window.location.href = "meiguang://" + s;
        //             }
        //             setTimeout(function () {
        //                 AjaxAct("GET", actPostUrl, "", function (A) {
        //                     document.write(A);
        //                 });
        //             }, 1000);
        //         }
        //     }
        // }
    }


}());