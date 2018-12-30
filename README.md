### 
#### 一个轻量的mongoDB操作封装类

---
nayo是一个基于mongoDB的js原生封装，基本思想是把每个操作(CURD)通过json格式进行包装形成任务包，从而操作mongoDB

#### 类：

factory():

生成factory实例，在配置文件中设置好~~~~改factory使用的db的地址，对于连接的collection名称，是在每个任务包中提供的，不用单独设置

#### 方法：

Factory.manage.push(work_list):

通过work_list执行相关CURD，其中work_list 为一个数组，包含一个元素，work_pack

```
work_pack = {
    collection: "xxx",
    target_doc: {xxx} / null,
    method: x,
    doc: {xxx} / null,
    param: {x},
    pipeline: [xxx] / null
}
```

method类别：

```
insert：0,
delete: 1,
find_one: 2,
find_one_update: 3,
aggregate: 4,
delete_many: 5,
update_many: 6
```

事务支持：
```
insert：0,
delete: 1,
find_one_update: 3,
delete_many: 5,
update_many: 6
```

补充：

1.pipeline只会对4生效，其他设置上没用，所以，当不需要的时候，可以设置为null；

2.对于方法1，3，5，6，push会先去检查是否有要操作的对象存在，这时候如果，不存在，那么会返回操作对象不可操作，存在的话，通过


- 新增 2018-08-23 v1.0.0

新增事务功能，当任务包work_list中任务work_pack大于一的时候，启用事务，需要注意的是，当前封装的事务只针对于除了查询操作之外的操作，比如0,1,3,5这些操作

- 新增 2018-10-06 v1.0.1

新增方法6批量更新，支持事务
