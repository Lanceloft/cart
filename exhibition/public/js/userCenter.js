require(['/js/common.js'],function(common){
    require(['jquery','moment'], function ($,moment) {
        //日期相减-->days
        function DateDiff(sDate1,sDate2){    //sDate1和sDate2是2002-12-18格式
            var  aDate,  oDate1,  oDate2,  iDays;
            aDate  =  sDate1.split("-");
            oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);    //转换为12-18-2002格式
            aDate  =  sDate2.split("-");
            oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
            iDays  =  parseInt((oDate1  -  oDate2)  /  1000  /  60  /  60  /24);    //把相差的毫秒数转换为天数
            return  iDays
        }
        $('.treeview').click(function () {
            $(this).find('.treeview-menu').toggle();
        });
        $('.treeview-menu').click(function (e) {
            e.stopPropagation();
        })
        //修改预约订单
        $('.changeCart').bind('click',function () {
            var parent = $(this).parent().parent();
            $('#changeCartInfo').removeClass('displayNone');
            $('.u_close_btn').click(function () {
                $('#changeCartInfo').addClass('displayNone');
            });
            $('#cartTitle').html(parent.find('.cName').text());
            $('#changePhone').val(parent.find('.uPhone').text());
            $('#changeNum').val(parent.find('.cQuantity').text());
            $('#changeUseTime').val(parent.find('.cUseTime').text());
            $('#changeCartDetail').val(parent.find('.uMsg').text());
            $('#changeCartSubmit').bind('click',function () {
                var price_1 = (parent.find('.cPrice').text())/(parent.find('.cQuantity').text());
                var uPhone = $('#changePhone').val(),
                    cQuantity = $('#changeNum').val(),
                    cUseTime = $('#changeUseTime').val(),
                    uMsg = $('#changeCartDetail').val();
                var thisDayChange = moment().format("YYYY-MM-DD");
                var DateDiffChange = DateDiff(cUseTime,thisDayChange);
                var cStatus = DateDiffChange>=7?0:1;
                console.log(cStatus)
               if(uPhone&&cQuantity&&cUseTime&&uMsg){
                   if(cQuantity>0){
                       if(DateDiffChange>=0){
                           var url = "http://127.0.0.1:3000/changeCart/"+parent.find('.dateIndex').data('index');
                           $.getJSON(url+'?callback=?',{
                               uPhone:uPhone,
                               cQuantity:cQuantity,
                               cUseTime:cUseTime,
                               uMsg:uMsg,
                               cPrice:price_1*cQuantity,
                               cStatus:cStatus,
                           },function () {
                               location.reload();
                               $('#changeExh').unbind('click');
                               $('#changeExhSubmit').unbind('click');
                           });
                       }else {
                           alert("请选择今天以后的日期");
                       }
                   }else {
                       alert("请输入合适的预约人数")
                   }
               }else {
                   alert("请完善表单后提交")
               }
            })
        })
        //一周确认
        $('.cartQue').click(function () {
            var thisDay = moment().format("YYYY-MM-DD");
            var DateDiff0 = DateDiff($(this).parent().parent().find('.cUseTime').text(),thisDay);
            if(DateDiff0>7){
                alert("请在距离参观时间一周内再来确认");
            }else if(DateDiff0<0){
                $(this).html("已过期")
            }else {
                var index = $(this).parent().parent().find('.dateIndex').attr("data-index");
                var url = "http://127.0.0.1:3000/cartToTrue/"+index;
                $.getJSON(url+'?callback=?',function () {
                    window.location.reload();
                });
            }
        });
        //删除
        $('.delCart').click(function () {
            if(window.confirm('你确定要取消预约吗？')){
                var parent = $(this).parent();
                var delNum = parent.parent().find('.cQuantity').text();
                var cUseTime = parent.parent().find('.cUseTime').text();
                var url = "http://127.0.0.1:3000/delFromCart/"+parent.data('index');
                $.getJSON(url+'?callback=?',{delNum:delNum,cUseTime:cUseTime},function () {
                    parent.parent().remove();
                });
                return true;
            }else{
                return false;
            }
        });
        //个人信息修改
        $('#changeUserInfoSumit').click(function () {
            var name = $('#userName').text();
            var password = $('#userPwd').val();
            var password_re = $('#userPwd_re').val();
            if(password.length>=6&&password.length<=16){
                if(password == password_re){
                    $.ajax({
                        url:'/cpwd',
                        type:'post',
                        data:{name:name,password:password},
                        success:function(data,status){
                            if(status == 'success'){
                                alert("密码修改成功")
                                location.href="/logout";
                            }else {
                                alert("err")
                            }
                        },
                        error:function(data,status){
                            alert('错误')
                        }
                    })
                }else {
                    alert("两次密码输入不匹配")
                }
            }else {
                alert("密码应为6-16位")
            }

        })
        $('.treeview-menu li').click(function (e) {
            $('.treeview-menu li').removeClass('active');
            $(this).addClass('active');
        });
        function hashChange(){
            var hash = location.hash;
            $('.main_module').hide();
            var navName1 = $('.breadcrumb li').eq(0);
            var navName2 = $('.breadcrumb li').eq(1);
            if(hash == "#myOrder"){
                $('.m_my_order').show();
            }else if(hash == "#m_changeUserInfo"){
                $('.m_changeUserInfo').show();
            }
        }
        if(window.location.hash) {
            hashChange();
        }else {
            $('.m_add_exh').show();
        }
        window.onhashchange = function(){
            hashChange();
        }
    })
});