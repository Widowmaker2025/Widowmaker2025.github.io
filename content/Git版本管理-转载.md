+++
title = "Git版本管理"
date = 2025-05-02

[taxonomies]
tags = ["git","转载","基础技能"]
+++

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.hanqunfeng.com](https://blog.hanqunfeng.com/2021/10/29/git-command/?highlight=git)

> 摘要 一起来了解一些 git 常用命令吧 推荐一个学习 git 命令的网站：https://learngitbranching.js.org/?locale=zh_CN

摘要
--

*   一起来了解一些 git 常用命令吧
*   推荐一个学习 git 命令的网站：[https://learngitbranching.js.org/?locale=zh_CN](https://learngitbranching.js.org/?locale=zh_CN)  
    [![][img-0]

基本概念
----

### Git 的 5 种工作区域

*   工作目录：用于新增、修改、删除文件，实际我们用于编写代码的目录
    
*   暂存区：执行`add`命令可以将工作目录对应的文件提交到暂存区，只有加入到暂存区的文件才会参与版本控制，其实际为一堆索引文件，保存在`.git/objects`目录下，记录每个文件的快照（hash）
    
*   本地版本库：执行`commit`命令可以将暂存区的文件提交到本地版本库，每一次提交都会记录版本日志，其实际保存位置也是`.git/objects`目录下的快照文件，每一次`commit`如果文件发生变化都会生成新的快照，`.git/refs/heads/`下记录每个分支的最新一次 commit 的版本号
    
*   远程跟踪区：`.git/refs/remotes/origin/`下记录每个分支的最新一次更新后的远程版本号，执行`fetch\pull\push`时都会更新为最新的远程版本号。如果只执行`fetch`仅仅会更新远程跟踪区，并不会更新本地目录，执行`pull`命令会同时更新远程跟踪区和本地目录
    
*   远程版本库：例如 github
    

### 文件的状态

*   Untracked: 未跟踪的文件，尚未加入过暂存区的文件
    

```
➜  git:(release) touch a.txt
➜  git:(release) ✗ git status
位于分支 release
您的分支与上游分支 'origin/release' 一致。

未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）
	a.txt

提交为空，但是存在尚未跟踪的文件（使用 "git add" 建立跟踪）
```

*   要提交的变更 [新增]，加入暂存区
    

```
➜  git:(release) ✗ git add .
➜  git:(release) ✗ git status
位于分支 release
您的分支与上游分支 'origin/release' 一致。

要提交的变更：
  （使用 "git restore --staged <文件>..." 以取消暂存）
	新文件：   a.txt
```

*   已提交版本库待发布到远端，将暂存区的文件加入本地版本库
    

```
➜  git:(release) ✗ git commit -m 'add a.txt'
[release 9292bb2] add a.txt
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 a.txt
➜  git:(release) git status
位于分支 release
您的分支领先 'origin/release' 共 1 个提交。
  （使用 "git push" 来发布您的本地提交）

无文件要提交，干净的工作区
```

*   尚未暂存以备提交的变更，加入过暂存区的文件发生修改
    

```
➜  git:(release) echo "hello" >> a.txt
➜  git:(release) ✗ git status
位于分支 release
您的分支领先 'origin/release' 共 1 个提交。
  （使用 "git push" 来发布您的本地提交）

尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git restore <文件>..." 丢弃工作区的改动）
	修改：     a.txt

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
```

*   要提交的变更 [修改]，加入过暂存区的文件重新加入暂存区
    

```
➜  git:(release) ✗ git add .
➜  git:(release) ✗ git status
位于分支 release
您的分支领先 'origin/release' 共 1 个提交。
  （使用 "git push" 来发布您的本地提交）

要提交的变更：
  （使用 "git restore --staged <文件>..." 以取消暂存）
	修改：     a.txt
```

### 切换分支时值得注意的地方

*   只要文件没有被 commit，无论是新增还是修改，切换分支时，文件的状态都会被带到切换后的分支
    
*   所以切换分支前，一定要执行 commit
    

### HEAD 指针和分支指针

*   我们在查看 git 的 log 时会看到类似于`* 6d93a15 (HEAD -> master) message`这样的信息，6d93a15 就是 commit 时的版本号，master 是分支名称，HEAD 就是`HEAD指针`，实际上这里的 master 也是一个指针，他就是`分支指针`
    
*   `分支指针`永远指向当前分支最新的一次提交版本，分支指针对应版本号保存在`.git/refs/heads/`目录下对应的分支文件中
    
*   `HEAD指针`表示我们当前的工作目录是基于哪个版本 checkout 出来的，通常情况下`HEAD指针`指向`分支指针`，但当我们通过命令`git checkout <commit号>`切换到某个版本时，`HEAD指针`就不再指向`分支指针`，这个情况有个名字叫作`detached HEAD(头分离)`，`HEAD指针`对应的版本号保存在`.git/HEAD`文件中，这也是为什么我们每次进入项目，git 都知道我们当前所在分支或版本号是什么。
    
*   参考资料：[https://www.zsythink.net/archives/3412/](https://www.zsythink.net/archives/3412/)
    

问题与方法
-----

### 1. 别人在远程仓库中创建了新的 branch，我本地执行`git branch -a`却看不到，如何才能看到并 checkout 呢？

```
git fetch origin

git fetch 








git branch -a


git checkout -b release（本地分支名） origin/release（远程分支名）
控制台输出：
分支 'release' 设置为跟踪来自 'origin' 的远程分支 'release'。
切换到一个新分支 'release'


git rev-parse --abbrev-ref --symbolic-full-name @{u}  
控制台输出：
origin/release
```

### 2. 如何查看本地分支与远程分支的区别？

```
git fetch origin

git fetch


git checkout master


git diff origin/master --stat


git diff origin/master..master --stat
```

### 3. 如何查看本地两个分支之间的区别？

```
git diff master..dev --stat


git diff master --stat
```

### 4. 如何查看本地的发生了哪些更改？

```
git diff --stat


git status


git diff --cached --stat


git diff HEAD --stat
```

### 5. 如何提交本地仓库？

```
git add .
git commit -m 'message'


 git commit -a -m 'message'
```

### 6.`git reset`: 如何回滚到指定版本或分支?

*   git reset 的作用是修改 HEAD 的位置，即将 HEAD 指向的位置改变为之前存在的某个版本，如果想恢复到之前某个提交的版本，且那个版本之后提交的版本我们都不要了，就可以用这种方法。
    
*   注意，如果 reset 包含了已经发布（`git push`）的的版本，此时如果用`git push`会报错，因为我们本地库 HEAD 指向的版本比远程库的要旧，需要执行命令`git push -f`强制更新远程
    
*   注意参数`--hard`有和没有的区别，有–hard，则完全回退到上一版本，丢弃所有其它修改，清空暂存区，同步工作目录到指定版本。没有–hard，则该版本之后的变化会变为 Modified 状态保留在工作目录，只清空暂存区。
    

```
git reset --hard HEAD^ 
git reset HEAD~1 


git reset --hard HEAD^^
git reset HEAD~2


git reset --hard 版本号


git log --oneline


git reset --hard 分支名称


git reset --hard origin/master


git reflog
```

### 7.`.gitignore`: 在 git 中如果想忽略掉某个文件，不让这个文件提交到版本库中，要怎么做呢？

```
*.a       
!lib.a    
/TODO     
build/    
doc/*.txt 


git config core.excludesfile .gitignore_dev


git config --global core.excludesfile ~/.gitignore_global




git rm --cached 文件名   
git rm -r --cached 文件夹   
git rm -r --cached .  

git rm -r 文件夹/文件名  


git add . 
git add file/dir 


git diff --cached


git commit -m "message" 
git commit -am "message"
```

### 8.`git commit --amend`: commit 后发现有内容要修改或者注释写错了，但是不想创建新的一次 commit，要怎么办呢？

*   以下命令如果直接合并到已经 push 过的版本，再次 git push 时会提示 "更新被拒绝，因为您当前分支的最新提交落后于其对应的远程分支"，此时可以执行`git push -f`强行发布即可。
    

```
git commit --amend  -am "注释"


git commit -a --amend --no-edit
```

### 9.`git log`–如何查看提交日志?

```
git log  
git log  --all 
git log --oneline 

git log --oneline --all --graph 


git log --all --grep='homepage' 


git log --author="hanqf"  


git reflog
```

### 10. 如何创建本地仓库并绑定到远程仓库?

```
git init 
git init dir 

git branch -m <name>

git config --global init.defaultBranch <名称>


git add . && git commit -m 'message'
git commit -am "备注"


git remote add origin https://xxxxx (远程仓库地址)


git pull --rebase origin master 
git push -u origin master 
git push origin master

git push
```

### 11. 远程仓库地址变更后如何更新？

```
git remote set-url origin [NEW_URL]


[remote "origin"]
    url = https://xxxxxx (修改为新的地址)
    fetch = +refs/heads/*:refs/remotes/origin/*


git remote get-url origin   


git remote -v
```

### 12. 如何将本地仓库同时绑定到多个远程仓库？

```
[remote "origin"]
    url = https://xxxxxxxx1  
    url = https://xxxxxxxx2  
    fetch = +refs/heads/*:refs/remotes/origin/*


git push -u origin master  

git push 


git remote -v
```

### 13. 如何在`git pull`时不用每次都输入密码？

```
git config --global credential.helper store


git pull
```

### 14. 如果文件已经`git add`到暂存区，但是尚未 commit，此时如何将文件从暂存区中移除？

```
git checkout -- <文件名> 



git restore --staged <文件路径>


git reset .  


git status



git rm --cached <文件名>   
git rm -r --cached <文件夹>   
git rm -r --cached .
```

### 15.`git config`: 如何设置和查看 git 配置信息？

```
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"


git config user.name "你的用户名"
git config user.email "你的邮箱"


git config --global --replace-all user.name "你的用户名"
git config --global --replace-all user.email "你的邮箱"


git config --list  

git config --global --list 

git config user.name 


git config --global --replace-all user.name "你的用户名"
git config --global --replace-all user.email "你的邮箱"


git config --replace-all user.name "你的用户名"
git config --replace-all user.email "你的邮箱"
```

### 16. 提交的文件太大 (默认是 1M)，导致 push 失败怎么办？

```
git config http.postBuffer 524288000

git config --global http.postBuffer 524288000
```

### 17.clone 代码最简单的方式是通过 https 的形式，不过一般这样做需要输入用户名和密码，如果不想输入用户名和密码可以使用`git@xxxx`的形式，如何实现呢？

```
ssh-keygen -b 4096 -t rsa 




ssh-keygen -b 4096 -t rsa -C "xxxxxxx"





ssh -T git@github.com


ssh -T git@e.coding.net



ssh -T git@gitee.com


git clone git@github.com:hanqunfeng/reactive-redis-cache-annotation-spring-boot-starter.git
```

### 18.`git branch`: 如何创建分支 \ 切换分支 \ 查看分支 \ 删除分支 \ 发布分支？

```
git branch release

git checkout release 
git checkout <commit号> 



git checkout -b release


git branch release dev

git checkout -b release dev


git branch release 799fb04
git checkout -b release 799fb04



git checkout -b release origin/release


git checkout -


git branch  
git branch --remote   
git branch -a  

cat .git/HEAD  
git symbolic-ref HEAD 




git branch -d release


git branch -D release  


git push --set-upstream origin <new branch name> 

git push origin <new branch name> 
git branch --set-upstream-to=origin/<new branch name> <new branch name> 


git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

### 19.merge 还是 rebase? 如何合并分支?

一般开发流程：

1.  更新主分支 git pull
    
2.  从主分支创建一个开发分支 git checkout -b dev，每个开发人员都会创建一个自己的开发分支
    
3.  开发分支完成测试后合并回主分支，这里推荐使用 git rebase，开发分支的 log 会被移动到主分支的顶端，这样主分支始终是一条线
    
4.  这样主分支在保持干净的同时还保留了每一次 commit 的 log，便于开发人员追溯历史
    
5.  也可以使用`git merge --no-ff`，其也会保留每次的 log 到主分支上
    

一般发布流程：

1.  将主分支测试完成后合并到发布分支，一般都是由一个专门的人员进行合并，此时推荐使用 git merge，这样每次一发布的版本都会产生一个新的节点，而主分支上的多次 commit 的 log 不会被记录到发布分支上
    
2.  这样发布分支看起来就是每一次大的发布才会合并一次并记录 log，log 中可以编辑本次发布的内容。
    

#### 示例准备，初始化一个待合并的目录

```
➜ mkdir git_test
➜ cd git_test
➜ touch 1.txt
➜ git init
[master（根提交） 5b91fc1] init...
 1 files changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 1.txt
➜ git:(master) git add . && git commit -m 'init...'
➜ git:(master) git checkout -b dev
➜ git:(dev) echo "dev1" >> a.txt
➜ git:(dev) ✗ git add . && git commit -m 'dev1'
[dev 8d57739] dev1
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt
➜ git:(dev) ✗ git checkout master
切换到分支 'master'
➜ git:(master) ✗ echo "master1" >> a.txt
➜ git:(master) ✗ git add . && git commit -m 'master1'
[master fa2400a] master1
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt
➜ git:(master) ✗ git checkout dev
切换到分支 'dev'
➜ git:(dev) ✗ echo "dev2" >> a.txt
➜ git:(dev) ✗ git add . && git commit -m 'dev2'
[dev 0006560] dev2
 1 file changed, 1 insertion(+)
➜ git:(dev) ✗ git checkout master
切换到分支 'master'
```

#### merge

将 dev 分支 merge 到当前分支

```
git merge dev
```

*   merge 会将 dev 分支和当前分支合并后创建一个新的节点放到当前分支最顶端，所以解决完冲突，需要执行如下命令创建一个新的 commit
    

```
git add . && git commit -m 'merge dev'
```

*   merge 的 log 会按照时间顺序显示
    
*   merge 后如果删除了 dev 分支，则在 log 中就看不到这个分支信息了，但是日志内容还在
    

##### merge 示例

```
➜ git:(master) ✗ git merge dev
冲突（add/add）：合并冲突于 a.txt
自动合并 a.txt
自动合并失败，修正冲突然后提交修正的结果。
➜ git:(master) ✗ vim a.txt
➜ git:(master) ✗ git add . && git commit -m 'master merge release'
➜ git:(master) git log --oneline   
➜ git:(master) git branch -D dev
已删除分支 dev（曾为 0006560）。
```

[![][img-1]  
删除 dev 分支后  
[![][img-2]

#### rebase

将 dev 分支 rebase 到当前分支

```
git rebase dev
```

*   rebase 会将 dev 分支的每一个节点转移到当前分支最顶端，而不会产生一个新的节点，这样 rebase 后的分支节点看起来就是一条线
    
*   解决完冲突，执行`git add .`和`git rebase --continue`，不会产生额外的 commit
    
*   rebase 后如果删除了 dev 分支，则在 log 中就看不到这个分支信息了，但是日志内容还在，这样看起来就是主分支自己的节点，没有产生过新的分支
    
*   如果要放弃本次合并，可以运行`git rebase --abort`
    

##### rebase 示例

```
➜  git:(master) git rebase dev
冲突（add/add）：合并冲突于 a.txt
自动合并 a.txt
error: 不能应用 0657382... master1
Resolve all conflicts manually, mark them as resolved with
"git add/rm <conflicted_files>", then run "git rebase --continue".
You can instead skip this commit: run "git rebase --skip".
To abort and get back to the state before "git rebase", run "git rebase --abort".
不能应用 0657382... master1
➜  git:(e4410b4) ✗ vim a.txt
➜  git:(e4410b4) ✗ git add .
➜  git:(e4410b4) ✗ git rebase --continue
[分离头指针 bd01ea0] master1
 1 file changed, 1 insertion(+)
成功变基并更新 refs/heads/master。
➜  git:(master) git log --oneline
➜  git:(master) git branch -D dev
已删除分支 dev（曾为 e4410b4）。
```

[![][img-3]  
删除 dev 分支后  
[![][img-4]

### 20.`git rebase -i`: 我 commit 了很多次，发现都是干的一件事，此时如果直接 rebase 到主分支会有很多没必要的 log，是否可以合并这些 commit 为一个呢？

```
git rebase -i  commit号 
git rebase -i  start_commit号 end_commit号  
git rebase -i HEAD~3   


git rebase -i  分支名称
```

*   如果修改的提交节点距离结束的提交节点中间有多个节点，而上一次和下一次都需要合并文件，这个过程就要进行多次。个人感觉这个过程虽然可以重新整理提交节点，使节点更准确清晰，但是如果修改的点比较远，文件内容变化复杂，这个多次合并的过程还是比较痛苦的，不推荐在这种情况下使用。
    
*   推荐的使用场景为，针对同一个功能进行修改，在 commit 后尚未进行 pushsa 时发现有些内容需要变化，如果此时没有进行 commit，可以执行`git commit --amend -am "注释"`, 如果已经执行了 commit，则可以执行`git rebase -i HEAD~2`。
    

#### 示例

```
git rebase -i HEAD~3
```

*   注意这里会进入两次编辑页面，一次是多个提交的处理方式，按提示进行修改即可，一般保留第一行的命令 pick，后面的行命令修改为 s，然后 wq 保存。
    
*   注意合并多个分支时如果包含已经发布过的分支，就要调整顺序，将已经发布的最后一个分支放到第一行，否则再次发布时会提示需要先执行`git pull`，这是因为按照上面的逻辑只有第一行的是提交操作，后面的不会产生新的提交，所以版本号就会落后于远端分支，但是即便调整顺序，也会提示版本偏离，还是要先执行`git pull`，待手工合并冲突后再次提交一个新的 commit，所以，最好的方法就是不要包含已经发布过的分支，只针对未发布的分支进行合并。  
    编辑后的：  
    [![][img-5]
    
*   第二个页面是要求你编辑本次合并的 log 说明，此时每次的 log 都会显示在这个页面，去掉不需要的，重新编辑一下保存即可。  
    [![][img-6]  
    编辑后的：  
    [![][img-7]
    

<div> <img src="/images_glob/git-command/rebase5.png" width="60%"> </div>

查看日志：git log --oneline  
[![][img-8]

### 21.`git revert`: 如何撤销指定的提交呢，就是把这次提交回滚到其前一次提交的状态，但是又不影响其之后的提交？

*   `git revert` 是回滚某个 commit ，不是回滚 “到” 某个
    
*   `git revert`是用一次新的 commit 来回滚之前的 commit，`git reset`是直接删除指定的 commit。
    
*   `git reset` 撤销到某次提交, `git revert` 撤销某次提交，撤销并不意味着删除本次提交，其 log 里仍然会有这次提交，只不过 revert 后会产生一个新的节点用于提交，而 reset 是会删除之前的 log。
    
*   需要回滚到上一个版本时，可以通过`git reset HEAD~1`实现，也可以通过执行`git revert HEAD`实现。区别就是 reset 后再次发布需要`git push -f`，而 revert 不需要 - f 参数，因为 revert 时会在顶端产生一个新的节点，其版本号一定比远端新的。
    
*   还有一点需要注意，例如 dev 是从 master checkout 出来的分支，然后针对 dev 执行 reset 时，如果 reset 的版本 master 里也包含，此时再将 dev merge 回 master 时，则 master 里会保留本应该被 reset 的内容，而执行 revert 则不会出现这个问题，因为 revert 是用一次逆向的 commit“中和” 之前的提交。
    

```
git revert HEAD        
git revert HEAD^       
git revert HEAD~3      
git revert commit号    


git revert -n HEAD~3
git revert -n <commit1>..<commit2>
```

### 22. 如何打 tag

```
git tag -a "prod_x.x.x" -m "message" 
git push origin "prod_x.x.x" 

git tag 
git show prod_x.x.x 

git checkout -b hotfix_x.x.x prod_x.x.x 
git push origin hotfix_x.x.x 
git branch --set-upstream-to=origin/hotfix_x.x.x hotfix_x.x.x
```

### 23.`git pull` = `git fetch` + `git merge`这种说法对吗？

*   默认情况下，`git pull` = `git fetch` + `git merge`
    
*   如果配置了 `pull.rebase=true`，那么 `git pull` 不再执行 `merge`，而是执行 `rebase`。
    

```
git config --global pull.rebase true


git config --global pull.rebase false



git config --global pull.rebase

git config pull.rebase
```

*   其实更好的比较是`git pull --rebase` 与 `git fetch` + `git merge`的区别，其相当于`git fetch` + `git rebase`
    

为了说清楚这个问题，我们需要先明白 git 的三个仓库：

1.  本地仓库：如 master，修改代码，提交暂存区，然后 commit 到的就是本地仓库
    
2.  本地远程跟踪仓库：如 orign/master，这个仓库不能用来直接提交代码，其用来保存上一次从远程仓库拉取到的最新版本，如果不主动执行 git fetch，git pull，git push 等，是不会更新这个版本的。
    
3.  远程仓库：git 服务器，如 github。执行 git push 时会将本地仓库的版本发布到远程仓库。
    

*   `git fetch`的作用是将远程仓库 (如 github)的版本与本地远程跟踪仓库 (如 orign/master) 的版本保持一致。之后我们在 master 分支下执行`git merge orign/master`就会将远程仓库的代码合并到本地仓库，所以合并后会产出一个新的版本，我们可以发布这个版本到远程仓库。
    
*   `git pull`的作用是先执行`git fetch`，再执行`git merge`，所以`git pull`会自动将远程仓库的代码合并到本地仓库，所以合并后会产出一个新的版本，我们可以发布这个版本到远程仓库。
    

### 24. 如何确定开发–> 测试–> 发布流程？

#### 开发 A 模型：基于 master 的主分支开发模型

[![][img-9]

*   使用 git rebase orign 将远程分支内容合并到当前 master 主分支，保证本地 master 始终是一条线
    
*   模型结构简单，始终记住使用`git fetch` + `git rebase`或者`git pull --rebase`更新主分支版本
    

#### 开发 B 模型：基于 dev 的子分支开发模型

[![][img-10]

*   增加了一个 dev 子分支，合并回 master 主分支时可以通过`git rebase -i`的方式合并多个 commit 为一个 commit，减少版本号数量
    
*   每次开发时要创建新的分支，开发完成后删除该分支，虽略显反锁，但也更加灵活，比如上一次的开发任务还没有完成，有一个紧急的任务需要马上处理，此时只需要从 master 分支 checkout 出一个子分支进行开发即可。
    
*   使用`git pull --rebase`更新远程版本，使用`git rebase dev`合并子分支，总的目标依旧是保证本地 master 始终是一条线
    

#### 测试模型：基于 A\B 模型的 master 的主分支

*   开发完成后，从 master 分支中 checkout 出一个 release 分支用于测试
    
*   测试过程中如果有 bug，则由开发人员通过开发模型进行修复，修复后 merge 到 release 中
    
*   测试通过后，将 release 分支内容 merge 到 prod 分支中（prod 表示生产分支，第一次时从 release 中 checkout 创建）
    
*   release 分支仅仅为了本次发布内容而创建的测试分支，所以发布后可以删除 release 分支
    

#### 发布模型

*   release 分支测试通过够会 merge 到 prod 生产分支，此时代码可以发布上线，上线前需要为 prod 打 tag
    
*   只有打了 tag 的代码才能部署上线，如果线上代码发现 bug，则从对应的 tag 中 checkout 一个 hotfix 分支，用于 bug 修复
    
*   bug 修复后从 hotfix 分支 checkout 出 hotfix_release 分支进行测试，测试过程按照`测试模型`进行
    
*   测试通过后按照`发布模型`进行
    
*   发布后需要将 hotfix_release 分支 merge 到 master 开发主分支，之后可以删除本次 hotfix 分支和 hotfix_release 分支
    

#### 说明

*   本地和远程始终存在的分支是 master 开发主分支和 prod 发布主分支
    
*   每次上线前一定要打 tag，tag 对应的就是当前生产环境
    
*   测试分支和修复分支根据需要进行创建，用后可以删除。
    

### 25.`git stash`: 我已经修改了本地的代码，但是还没有 commit，但是又想切到其他分支，不想丢弃修改，也不想把这些修改带到其它分支，因为代码还有用，当切回时还需要恢复这些修改，那么该怎么处理？

*   `git stash`可以做到这一点，其会将工作区中的更改（包括未暂存和已暂存的文件）保存到一个临时区域（称为 “stash 栈”），并将工作目录恢复为干净的状态。
    
*   其特点是非破坏性操作，改动不会丢失，可以随时取回，这在切换分支或处理紧急任务时非常有用。
    

#### 创建一个 stash

*   将当前分支上所有未提交的更改（包括工作区和暂存区的内容）保存到 stash 栈中。
    
*   执行后，工作目录会变得干净（与最近的一次提交一致）。
    

```
$ git stash
保存工作目录和索引状态 WIP on main: c4f0eaf 2024-12-05 11:43:57#brew


$ git stash save "描述信息"
保存工作目录和索引状态 On main: 描述信息
```

#### 查看 stash

*   查看当前的 stash 栈，包括每个 stash 的编号、提交信息、日期和时间等。
    

```
$ git stash list
stash@{0}: WIP on main: c4f0eaf 2024-12-05 11:43:57#brew
```

#### 恢复 stash

*   从 stash 栈中恢复最近一次保存的 stash，但 不会删除 stash。
    
*   执行后，工作目录会恢复到 stash 保存的状态
    

```
$ git stash apply
位于分支 main
您的分支与上游分支 'origin/main' 一致。

尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git restore <文件>..." 丢弃工作区的改动）
        修改：     source/_posts/git-command.md

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）


$ git stash apply stash@{1}
```

#### 删除 stash

```
$ git stash drop
丢弃了 refs/stash@{0}（6f483ee0c0753762a497d24f424c8998372e96a9）


$ git stash drop stash@{1}
丢弃了 stash@{1}（50a9e83d3bf96e2f3ca5368d2a248113874507b9）


$ git stash clear
```

#### 恢复并删除 stash

*   等价于 `git stash apply` + `git stash drop`
    

```
$ git stash pop

位于分支 main
您的分支与上游分支 'origin/main' 一致。

尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git restore <文件>..." 丢弃工作区的改动）
        修改：     source/_posts/git-command.md

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
丢弃了 refs/stash@{0}（63a7551a9bc920f82802cbda542da99800b8a58c）
```

#### 注意事项

*   如果有未追踪的文件，需要用 `git stash -u` 或 `git stash --include-untracked` 才会保存。
    

#### 典型的使用场景

*   1. 假设当前分支有未完成的更改，但需要切换到其他分支紧急处理一些问题
    

```
git stash

git checkout 其他分支

git checkout 原分支

git stash pop
```

*   如果 stash 恢复时遇到冲突，比如文件被修改了，则需要手动解决冲突
    

```
$ git stash pop
错误：您对下列文件的本地修改将被合并操作覆盖：
        source/_posts/git-command.md
请在合并前提交或贮藏您的修改。
正在终止
位于分支 main
您的分支与上游分支 'origin/main' 一致。

尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git restore <文件>..." 丢弃工作区的改动）
        修改：     source/_posts/git-command.md

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
贮藏条目被保留以备您再次需要。


$ git add .



$ git stash pop
自动合并 source/_posts/git-command.md
冲突（内容）：合并冲突于 source/_posts/git-command.md
位于分支 main
您的分支与上游分支 'origin/main' 一致。

未合并的路径：
  （使用 "git restore --staged <文件>..." 以取消暂存）
  （使用 "git add <文件>..." 标记解决方案）
        双方修改：   source/_posts/git-command.md

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
贮藏条目被保留以备您再次需要。


$ git stash list
stash@{0}: WIP on main: c4f0eaf 2024-12-05 11:43:57#brew


$ git stash drop
```

*   2. 本地修改了部分文件，但此时需要更新远程仓库，此时需要先将本地修改的文件暂存，再更新远程仓库，最后再恢复本地修改的文件。
    

```
git pull --rebase --autostash
```

[img-0]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MTQ3OEFCMzM0MzRFQTc4NEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9naXQucG5naHR0cHM6Ly91cGljLW9zcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vYmxvZy9naXQucG5nPC9LZXk+CiAgPEVDPjAwMjYtMDAwMDAwMDE8L0VDPgogIDxSZWNvbW1lbmREb2M+aHR0cHM6Ly9hcGkuYWxpeXVuLmNvbS90cm91Ymxlc2hvb3Q/cT0wMDI2LTAwMDAwMDAxPC9SZWNvbW1lbmREb2M+CjwvRXJyb3I+Cg==

[img-1]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MTQ3OEFCMzM0MzQyRDc5NEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9tZXJnZTEucG5naHR0cHM6Ly91cGljLW9zcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vYmxvZy9tZXJnZTEucG5nPC9LZXk+CiAgPEVDPjAwMjYtMDAwMDAwMDE8L0VDPgogIDxSZWNvbW1lbmREb2M+aHR0cHM6Ly9hcGkuYWxpeXVuLmNvbS90cm91Ymxlc2hvb3Q/cT0wMDI2LTAwMDAwMDAxPC9SZWNvbW1lbmREb2M+CjwvRXJyb3I+Cg==

[img-2]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MjQ3OEFCMzM0MzQ1QTc5NEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9tZXJnZTIucG5naHR0cHM6Ly91cGljLW9zcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vYmxvZy9tZXJnZTIucG5nPC9LZXk+CiAgPEVDPjAwMjYtMDAwMDAwMDE8L0VDPgogIDxSZWNvbW1lbmREb2M+aHR0cHM6Ly9hcGkuYWxpeXVuLmNvbS90cm91Ymxlc2hvb3Q/cT0wMDI2LTAwMDAwMDAxPC9SZWNvbW1lbmREb2M+CjwvRXJyb3I+Cg==

[img-3]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MjQ3OEFCMzM0MzQ5Mjc5NEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9yZWJhc2UxLnBuZ2h0dHBzOi8vdXBpYy1vc3Mub3NzLWNuLWJlaWppbmcuYWxpeXVuY3MuY29tL2Jsb2cvcmViYXNlMS5wbmc8L0tleT4KICA8RUM+MDAyNi0wMDAwMDAwMTwvRUM+CiAgPFJlY29tbWVuZERvYz5odHRwczovL2FwaS5hbGl5dW4uY29tL3Ryb3VibGVzaG9vdD9xPTAwMjYtMDAwMDAwMDE8L1JlY29tbWVuZERvYz4KPC9FcnJvcj4K

[img-4]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MjQ3OEFCMzM0MzRDMDc5NEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9yZWJhc2UyLnBuZ2h0dHBzOi8vdXBpYy1vc3Mub3NzLWNuLWJlaWppbmcuYWxpeXVuY3MuY29tL2Jsb2cvcmViYXNlMi5wbmc8L0tleT4KICA8RUM+MDAyNi0wMDAwMDAwMTwvRUM+CiAgPFJlY29tbWVuZERvYz5odHRwczovL2FwaS5hbGl5dW4uY29tL3Ryb3VibGVzaG9vdD9xPTAwMjYtMDAwMDAwMDE8L1JlY29tbWVuZERvYz4KPC9FcnJvcj4K

[img-5]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MjQ3OEFCMzM0MzRGMDc5NEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9yZWJhc2UzLnBuZ2h0dHBzOi8vdXBpYy1vc3Mub3NzLWNuLWJlaWppbmcuYWxpeXVuY3MuY29tL2Jsb2cvcmViYXNlMy5wbmc8L0tleT4KICA8RUM+MDAyNi0wMDAwMDAwMTwvRUM+CiAgPFJlY29tbWVuZERvYz5odHRwczovL2FwaS5hbGl5dW4uY29tL3Ryb3VibGVzaG9vdD9xPTAwMjYtMDAwMDAwMDE8L1JlY29tbWVuZERvYz4KPC9FcnJvcj4K

[img-6]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MjQ3OEFCMzM0MzQyRDdBNEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9yZWJhc2U0LnBuZ2h0dHBzOi8vdXBpYy1vc3Mub3NzLWNuLWJlaWppbmcuYWxpeXVuY3MuY29tL2Jsb2cvcmViYXNlNC5wbmc8L0tleT4KICA8RUM+MDAyNi0wMDAwMDAwMTwvRUM+CiAgPFJlY29tbWVuZERvYz5odHRwczovL2FwaS5hbGl5dW4uY29tL3Ryb3VibGVzaG9vdD9xPTAwMjYtMDAwMDAwMDE8L1JlY29tbWVuZERvYz4KPC9FcnJvcj4K

[img-7]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MjQ3OEFCMzM0MzQ2RDdBNEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9yZWJhc2U1LnBuZ2h0dHBzOi8vdXBpYy1vc3Mub3NzLWNuLWJlaWppbmcuYWxpeXVuY3MuY29tL2Jsb2cvcmViYXNlNS5wbmc8L0tleT4KICA8RUM+MDAyNi0wMDAwMDAwMTwvRUM+CiAgPFJlY29tbWVuZERvYz5odHRwczovL2FwaS5hbGl5dW4uY29tL3Ryb3VibGVzaG9vdD9xPTAwMjYtMDAwMDAwMDE8L1JlY29tbWVuZERvYz4KPC9FcnJvcj4K

[img-8]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MjQ3OEFCMzM0MzRBQzdBNEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9yZWJhc2U2LnBuZ2h0dHBzOi8vdXBpYy1vc3Mub3NzLWNuLWJlaWppbmcuYWxpeXVuY3MuY29tL2Jsb2cvcmViYXNlNi5wbmc8L0tleT4KICA8RUM+MDAyNi0wMDAwMDAwMTwvRUM+CiAgPFJlY29tbWVuZERvYz5odHRwczovL2FwaS5hbGl5dW4uY29tL3Ryb3VibGVzaG9vdD9xPTAwMjYtMDAwMDAwMDE8L1JlY29tbWVuZERvYz4KPC9FcnJvcj4K

[img-9]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MjQ3OEFCMzM0MzREOTdBNEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9BLWdpdC1kZXYucG5naHR0cHM6Ly91cGljLW9zcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vYmxvZy9BLWdpdC1kZXYucG5nPC9LZXk+CiAgPEVDPjAwMjYtMDAwMDAwMDE8L0VDPgogIDxSZWNvbW1lbmREb2M+aHR0cHM6Ly9hcGkuYWxpeXVuLmNvbS90cm91Ymxlc2hvb3Q/cT0wMDI2LTAwMDAwMDAxPC9SZWNvbW1lbmREb2M+CjwvRXJyb3I+Cg==

[img-10]:data:application/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEVycm9yPgogIDxDb2RlPk5vU3VjaEtleTwvQ29kZT4KICA8TWVzc2FnZT5UaGUgc3BlY2lmaWVkIGtleSBkb2VzIG5vdCBleGlzdC48L01lc3NhZ2U+CiAgPFJlcXVlc3RJZD42ODE0MjI2MjQ3OEFCMzM0MzQwNTdCNEU8L1JlcXVlc3RJZD4KICA8SG9zdElkPnVwaWMtb3NzLm9zcy1jbi1iZWlqaW5nLmFsaXl1bmNzLmNvbTwvSG9zdElkPgogIDxLZXk+YmxvZy9CLWdpdC1kZXYucG5naHR0cHM6Ly91cGljLW9zcy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20vYmxvZy9CLWdpdC1kZXYucG5nPC9LZXk+CiAgPEVDPjAwMjYtMDAwMDAwMDE8L0VDPgogIDxSZWNvbW1lbmREb2M+aHR0cHM6Ly9hcGkuYWxpeXVuLmNvbS90cm91Ymxlc2hvb3Q/cT0wMDI2LTAwMDAwMDAxPC9SZWNvbW1lbmREb2M+CjwvRXJyb3I+Cg==