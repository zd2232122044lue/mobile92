// 1.导入localize模块函数
import { extend,localize } from 'vee-validate'
// 导入全部的规则
import * as rules from 'vee-validate/dist/rules'

// 2.导入要使用的语言
import zhCN from 'vee-validate/dist/locale/zh_CN.json'
// 3.对导入好的语言做注册
localize({
    zhCN // 对象成员简易赋值
})
// 4.使用具体的语言
localize('zhCN')

// 注册全部的规则
Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule])
})
// Object.keys(rules) 获得对象中全部的属性名称
// extend(rule, rules[rule]) 完成每个内置校验规则的注册操作