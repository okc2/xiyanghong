//加载element layer模块

layui.use(['element','layer','form'],function (exports) {
    var $=layui.jquery;
    var element=layui.element;
    var layer=layui.layer;
    var form=layui.form;

    form.render();//只有执行了这一步，部分表单元素 如select 下拉 才会自动修饰成功//更新全部表单数据


    //自动调用下面这个函数
    $(function () {
        var show_num=[];
        draw(show_num); //上来就生成一个验证码
        $("#canvas").on('click',function () {
           draw(show_num);//点击验证码重新生成
        });

        $('#registerBtn').on('click',function () {
            layer.open({ //发送请求 controller返回一个jsp页面 加载在这个open的弹出窗口中
                type:2,
                title:"注册用户",
                area:['400px','600px'],
                content:ctx+"/admin/register"
            })
        });

        $('#loginBt').on('click',function () {//点击登录按钮
            var code=$('#code').val();//获得用户输入的验证码
            var username=$('#username').val();
            var password=$('#password').val();
            var num=show_num.join("");//将生成的验证码数组转换成字符串
/*            alert("输入的验证码"+code);
            alert("生成的验证码"+num)*/
            var url;
            var level=$('#level').val();
            switch (parseInt(level)) {
                case 0:
                    layer.alert("请选择用户类型");
                    return false;
                case 1:
                    url="/admin/login";
                    break;
                case 2:
                    url="/user/login";
                    break;
                case 3:
                    url="/doctor/login";
                    break;
                case 4:
                    url="/familymember/login";
                    break;
                case 5:
                    url="/nursingstuff/login";
                    break;
                case 6:
                    url="/nurse/login";
                    break;
            }

            if(""==username)
            {
                layer.alert("请输入用户名！");
                $("#code").val('');//将用户输入的验证码清空
                return false; //不让页面跳转
            }
            else if(""==password)
            {
                layer.alert("请输入密码");
                $("#code").val('');
                return false;
            }
            if(""==code)
            {
                layer.alert("请输入验证码");
                $("#password").val('');
                draw(show_num);
                return false;
            }
            else if((code.toLowerCase())==(num.toLowerCase()))//验证码都转换成小写
            //else if((num.toLowerCase())==(num.toLowerCase()))//验证码都转换成小写
            {
                var i;
                //发送异步请求
                $.ajax({
                    type:"post",
                    url:ctx+url,
                    data:{
                        username:username,
                        password:password
                    },
                    dataType: "json",
                    beforeSend:function () {
                      i=show_wait(); //弹出层 旋转图标 表示正在处理
                    },
                    success:function (result) {//表示发送请求 接受返回都没有错误
                        if(result.code==0)  //登陆成功
                        {
                            parent.location.href=ctx+'/admin/allmain'; //这也是发送请求url 但是不是ajax请求 是普通请求
                            close_wait(i);
                        }
                        else if(result.code!=0)
                        {
                            var msg=result.msg;
                            //shade:[0.5,'#000000']表示弹出信息对话框 后面的背景变黑0.5秒 闪一下
                            layer.msg(msg,{icon:5,shade:[0.5,'#000000'],shadeClose:true});
                            draw(show_num);
                            close_wait(i);
                        }
                    },
                    error:function (jqXHR, textStatus, errorThrown) {
                        layer.alert("获取数据失败!");

                        draw(show_num);
                        close_wait(i);
                    }
                });
                $("#code").val('');
                $("#username").val('');
                $("#password").val('');
                return false;
            }
            else
            {
               layer.msg('验证码错误',{icon:5,shade:[0.5,'#000000'],shadeClose:true});
               $("#code").val('');
               $("#password").val('');
               draw(show_num);
               return false;
            }

        });

    });

    function show_wait() {
        return layer.load(1,{shade:[0.5,'#000']}); //弹出一个 旋转图标 表示正在处理 不会自己关闭 必须用下面的函数关闭
    }
    function close_wait(index) {
        layer.close(index);//关闭 弹出的 旋转图标 和上面函数一起使用
    }


    function draw(show_num) {
        //页面中有个id 为canvas的元素 所以用#获取
        var canvas_width=$('#canvas').width();
        var canvas_height=$('#canvas').height();
        var canvas=document.getElementById("canvas");
        var context=canvas.getContext("2d");//参数 contextID 指定了您想要在画布上绘制的类型。当前唯一的合法值是 "2d"，它指定了二维绘图，并且导致这个方法返回一个环境对象，该对象导出一个二维绘图 API。
        canvas.width=canvas_width;
        canvas.height=canvas_height;
        var sCode="a,b,c,d,e,f,g,h,i,j,k,l,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
        var aCode=sCode.split(","); //aCode是一个数组
        var aLength=aCode.length;
        for(var i=0;i<=3;i++) //绘制四位随机验证码
        {
            var j=Math.floor(Math.random()*aLength); //random只产生0到1之间的小数 floor返回小于等于参数的最大整数
            var txt=aCode[j];
            //show_num[i]=txt.toLowerCase();
            show_num[i]=txt;
            var x = 10 + i * 20;
            var y = 20 + Math.random() * 8;
            context.font = "bold 23px 微软雅黑";

            context.translate(x, y);

            context.fillStyle = randomColor();
            context.fillText(txt, 0, 0);

            context.translate(-x, -y);
        }
        for (var i = 0; i < 3; i++) { //绘制随机的3个线条
            context.strokeStyle = randomColor();
            context.beginPath();
            context.moveTo(Math.random() * canvas_width, Math.random()
                * canvas_height);
            context.lineTo(Math.random() * canvas_width, Math.random()
                * canvas_height);
            context.stroke();
        }
        for (var i = 0; i < 10; i++) { //绘制10个干扰点
            context.strokeStyle = randomColor();
            context.beginPath();
            var x = Math.random() * canvas_width;
            var y = Math.random() * canvas_height;
            context.moveTo(x, y);
            context.lineTo(x + 1, y + 1);
            context.stroke();
        }
    };

    function randomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    };

});
