/**
 * @file CheckBox.js
 * @author mengke01
 * @date 2013-12-19
 * @description
 * checkbox组件
 */

define(
    function(require) {
        var lib = require('zxui/lib');
        var Control = require('zxui/Control');

        /**
         * 对话框
         * 
         * @extends module:Control
         * @requires lib
         * @requires Control
         * @exports CheckBox
         * @example
         * 
         * new CheckBox({
         *   main: '',
         *   prefix: 'ecl-ui-checkbox',
         *   name: '',
         *   content: '选择框',
         *   checked: false
         * })
         * 
         */
        var CheckBox = Control.extend(/** @lends module:CheckBox.prototype */{
            
            /**
             * 控件类型标识
             * 
             * @type {string}
             * @override
             * @private
             */
            type: 'CheckBox',

            /**
             * 控件配置项
             * 
             * @name module:CheckBox#options
             * @type {Object}
             * @property {HTMLElement} options.main 主容器
             * @property {string} options.prefix 样式前缀
             * @property {string} options.name 当前控件的名字
             * @property {Object} options.value 当前控件的值
             * @property {string} options.content 框内文本
             * @property {boolean} options.checked 是否已选中
             * @property {string} options.tpl 内部模板，
             * 如果不需要组件渲染内部，则tpl设为空
             * @property {string} options.onChange 改变选择的事件
             * @private
             */
            options: {

                //主容器
                main: '',

                // 控件class前缀，同时将作为main的class之一
                prefix: 'ecl-ui-checkbox',

                //名字
                name: '',

                //值
                value: null,

                //文字内容
                content: '',

                //是否选中
                checked: false,

                //onChange事件
                onChange: null,

                //模板框架
                tpl:  ''
                    +   '<i class="#{iconClass}"></i>'
                    +   '<span class="#{contentClass}">#{content}</span>'
            },

            /**
             * 需要绑定 this 的方法名，多个方法以半角逗号分开
             * 
             * @type {string}
             * @private
             */
            binds: 'onClick',

            /**
             * 控件初始化
             * 
             * @param {Object} options 控件配置项
             * @see module:Control#options
             * @private
             */
            init: function (options) {
                this.main = this.options.main;
            },

            /**
             * 根据名字构建的css class名称
             *  
             * @param {string} name 模块名字
             * @return {string} 构建的class名称
             * @private
             */
            getClass: function(name) {
                name = name ? '-' + name : '';
                return this.options.prefix + name;
            },

            /**
             * 获得指定dialog模块的dom元素
             *  
             * @param {string} name 模块名字
             * @param {string} scope 查找范围
             * @return {HTMLElement} 模块的DOM元素
             * @private
             */
            getDom: function(name, scope) {
                return lib.q( 
                    this.getClass(name), 
                    lib.g(scope)
                )[0];
            },

            /**
             * 点击事件
             * 
             * @param {HTMLEvent} e dom事件
             * @private
             */
            onClick: function(e) {
                var e = {
                    checked: !this.options.checked
                };

                //onChange事件

                if(typeof this.options.onChange === 'function') {
                    this.options.onChange.call(this, e);
                }

                /**
                 * @event module:CheckBox#change
                 * @param {Object} e 事件源对象
                 * @param {boolean} e.checked 是否被选中
                 */
                this.fire('change', e);

                //只有没有阻止事件才算选中
                if(false !== e.returnValue) {
                    !this.options.checked 
                        ? this.check() : this.unCheck();
                }
            },

            /**
             * 选中选择框
             * @public
             */
            check: function() {
                if(!this.options.checked) {
                    lib.addClass(
                        this.main, 
                        this.getClass('checked')
                    );
                    this.options.checked = 1;
                }
            },

            /**
             * 取消选中选择框
             * @public
             */
            unCheck: function() {
                if(this.options.checked) {
                    lib.removeClass(
                        this.main, 
                        this.getClass('checked')
                    );
                    this.options.checked = 0;
                }
            },

            /**
             * 判断是否被选中
             * 
             * @return {boolean} 是否选中
             * @public
             */
            isChecked: function() {
                return !!this.options.checked;
            },

            /**
             * 设置提示内容
             * @param {string} content 内容字符串
             * @public
             */
            setContent: function(content) {
                this.getDom('content').innerHTML = content;
            },

            /**
             * 绘制控件
             * 
             * @override
             * @public
             */
            render: function () {

                if (!this.rendered && this.main) {

                    var options = this.options;

                    //如果提供tpl模板，则使用自渲染模式，
                    // 此时需要提供content
                    if(this.options.tpl) {
                        var cls = {
                            'iconClass' : this.getClass('ico'),
                            'contentClass': this.getClass('text'),
                            'content': options.content
                        };

                        //获取HTML
                        var html = this.options.tpl.replace( 
                            /#\{([\w-.]+)\}/g, 
                            function($0, $1) {
                                return cls[$1] || '';
                            }
                        );

                        this.main.innerHTML = html;
                    }

                    lib[options.checked ? 'addClass' : 'removeClass'](
                        this.main, 
                        this.getClass('checked')
                    );

                    lib.on(this.main, 'click', this.onClick);

                    this.name = options.name;

                    this.value = options.value;

                    this.rendered = true;
                }
                return this;
            },

            /**
             * 销毁，注销事件，解除引用
             * 
             * @public
             * @fires module:CheckBox#dispose
             */
            dispose: function() {
                lib.un(this.main, 'click', this.onClick);
                this.parent('dispose');
            }
        });

        return CheckBox;
});