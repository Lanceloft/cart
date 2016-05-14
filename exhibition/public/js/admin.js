require(['/js/common.js'],function(common){
    require(['jquery'], function ($) {
        $('.treeview').click(function () {
            $(this).find('.treeview-menu').toggle();
        });
        $('.treeview-menu').click(function (e) {
            e.stopPropagation();
        })
        $('#delUser').click(function(){
            var userName = $('.user').text().trim();
            $.ajax({
                url:'delUser',
                type:'post',
                data:{userName:userName},
                success:function(data,status){
                    if(status == 'success'){
                        location.href='admin'
                    }
                },
                error:function(data,status){
                    alert('错误')
                }
            })
        })
        $('.updateBtn').click(function(){
            $(this).parent().find('input,.commitBtn').removeClass('displayNone');
            $(this).parent().find('.commitBtn').click(function(){
                var oname = $(this).parent().find('.oName').text(),
                    nname = $(this).parent().find('.name').val(),
                    price = $(this).parent().find('.price').val(),
                    imgSrc = $(this).parent().find('.imgSrc').val();
                $.ajax({
                    url:'/updateCommodity',
                    type:'post',
                    data:{oname:oname,nname:nname,price:price,imgSrc:imgSrc},
                    success:function(data,status){
                        if(status == 'success'){
                            location.reload();
                        }
                    },
                    error: function (data,status) {
                        alert('error');
                    }
                })
            })
        });
        //添加展厅（上传图片）
        $('#imgUpload').click(function () {
            var fd = new FormData();
            fd.append("file",$('#file')[0].files[0]);
            $('.imgSrc').removeClass('displayNone');
            $('.imgSrcName').html($('#file')[0].files[0].name);
            $.ajax({
                type:'POST',
                dataType:'text',
                processData: false,  // 告诉JSLite不要去处理发送的数据
                contentType: false,   // 告诉JSLite不要去设置Content-Type请求头
                data:fd,
                url:'/upload',
                success:function(data){
                },
                error:function(d){
                    console.log('error:',d)
                }
            })
        })
        //添加展厅
        $('#addExh').click(function () {
            var name = $('#addName').val();
            var price = $('#addPrice').val();
            var addPhone = $('#addPhone').val();
            var addAddress = $('#addAddress').val();
            var imgSrc = $('.imgSrcName').text();
            var addPeople = $('#addPeople').val();
            var detail = $('#addDetail').val();
            var addType = $('#addType').val();
            if(name&&price&&imgSrc&&detail&&addPhone&&addPeople){
                $.ajax({
                    url:'/addcommodity',
                    type:'post',
                    data:{
                        "name": name,
                        "price": price,
                        "phone": addPhone,
                        "address": addAddress,
                        "imgSrc": imgSrc,
                        "sumNum":addPeople,
                        "detail":detail,
                        "type":addType,
                        "status":"true"
                    },
                    success:function(data,status){
                        if(status == 'success'){
                            alert("添加成功");
                            window.location.reload();
                        }
                    },
                    error: function (data,status) {
                        alert('error');
                    }
                })
            }else {
                alert('请完善展厅信息后再添加');
            }
        });
        //修改展厅
        $('.changeExh').bind('click',function () {
            var parent = $(this).parent();
            $('#changeExhInfo').removeClass('displayNone');
            $('.u_close_btn').click(function () {
                $('#changeExhInfo').addClass('displayNone');
            });
            $('#changeExhName').val(parent.parent().find('.exhName').text());
            $('#changeExhPrice').val(parent.parent().find('.exhPrice').text());
            $('#changeExhPhone').val(parent.parent().find('.exhPhone').text());
            $('#changeExhDetail').val(parent.parent().find('.exhDetail').text());
            $('#changeExhSubmit').bind('click',function () {
                var nName = $('#changeExhName').val(),
                    nPrice = $('#changeExhPrice').val(),
                    nPhone = $('#changeExhPhone').val(),
                    nDetail = $('#changeExhDetail').val();
                var url = "http://127.0.0.1:3000/changeExh/"+parent.data('index');
                $.getJSON(url+'?callback=?',{
                    name:nName,
                    price:nPrice,
                    phone:nPhone,
                    detail:nDetail
                },function () {
                    parent.parent().find('.exhName').text(nName);
                    parent.parent().find('.exhPrice').text(nPrice);
                    parent.parent().find('.exhPhone').text(nPhone);
                    parent.parent().find('.exhDetail').text(nDetail);
                    $('#changeExhInfo').addClass('displayNone');
                    $('#changeExh').unbind('click');
                    $('#changeExhSubmit').unbind('click');
                });
            })
        })
        //下架
        $('.downExh').click(function () {
            var parent = $(this).parent();
            var url = "http://127.0.0.1:3000/exhToFalse/"+parent.data('index');
            $.getJSON(url+'?callback=?',function () {
                parent.parent().find('.exhStatus').html("false");
            });
        });
        //上架
        $('.upExh').click(function () {
            var parent = $(this).parent();
            var url = "http://127.0.0.1:3000/exhToTrue/"+parent.data('index');
            $.getJSON(url+'?callback=?',function () {
                parent.parent().find('.exhStatus').html("true");
            });
        });
        //删除
        $('.delExh').click(function () {
            if(window.confirm('你确定要删除这个展馆吗？')){
                var parent = $(this).parent();
                var url = "http://127.0.0.1:3000/delExh/"+parent.data('index');
                $.getJSON(url+'?callback=?',function () {
                    parent.parent().remove();
                });
                return true;
            }else{
                return false;
            }
        });
        $('.treeview-menu li').click(function (e) {
            $('.treeview-menu li').removeClass('active');
            $(this).addClass('active');
        });
        function hashChange(){
            var hash = location.hash;
            $('.main_module').hide();
            var navName1 = $('.breadcrumb li').eq(0);
            var navName2 = $('.breadcrumb li').eq(1);
            if(hash == "#addExh"){
                $('.m_add_exh').show();
                navName1.text("展厅管理");
                navName2.text("添加展览馆");
            }else if(hash == "#changeExh"){
                $('.m_change_exh').show();
                navName1.text("展厅管理");
                navName2.text("修改展览馆信息");
            }else if(hash == "#changeYuyue"){
                $('.m_change_exh').show();
                navName1.text("预约管理");
                navName2.text("客户预约修改");
            }else if(hash == "#delYuyue"){
                $('.m_change_exh').show();
                navName1.text("预约管理");
                navName2.text("客户预约删除");
            }else if(hash == "#watchHuiyuan"){
                $('.m_change_exh').show();
                navName1.text("会员管理");
                navName2.text("会员列表查看");
            }else if(hash == "#changeHuiyuan"){
                $('.m_change_exh').show();
                navName1.text("会员管理");
                navName2.text("会员信息修改");
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