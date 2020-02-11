import { extend } from 'vee-validate'
// 导入全部的规则
import * as rules from 'vee-validate/dist/rules'

// 注册全部的规则
Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule])
})
// Object.keys(rules) 获得对象中全部的属性名称
// extend(rule, rules[rule]) 完成每个内置校验规则的注册操作