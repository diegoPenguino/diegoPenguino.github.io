# Formulary
## Algebra
### Binomial theorem
$(a+b)^n=\sum _{k=0}^n \binom{n}{k} a^{n-k} b^k$<br>

## Trigonometric identities
### Transformation
$\sin (-\theta) =-\sin \theta$ <br>
$\cos (-\theta) =\cos \theta$<br>
$\tan (-\theta)  =-\tan \theta$<br>
$\sin (\pi-\theta)=\sin \theta$<br>
$\cos (\pi-\theta)=-\cos \theta$<br>
$\tan (\pi-\theta)=-\tan \theta$<br>
$\tan (\theta+\pi) =\tan \theta$<br>

$\begin{array}{ll}\cos \theta=\sin \left(\frac{\pi}{2}-\theta\right) & \sin \theta=\cos \left(\frac{\pi}{2}-\theta\right) \\ \cot \theta=\tan \left(\frac{\pi}{2}-\theta\right) & \tan \theta=\cot \left(\frac{\pi}{2}-\theta\right) \\ \csc \theta=\sec \left(\frac{\pi}{2}-\theta\right) & \sec \theta=\csc \left(\frac{\pi}{2}-\theta\right)\end{array}$

### Sum of angles
$\sin (\alpha\pm\beta)=\sin \alpha \cos \beta\pm\cos \alpha \sin \beta$<br>
$\cos (\alpha\pm\beta)=\cos \alpha\cos \beta\mp\sin \alpha \sin \beta$<br>
$\tan (\alpha\pm\beta)=\frac{\tan \alpha\pm\tan \beta}{1\mp\tan \alpha \tan \beta}$<br>

$\cos (2 \theta)  =\cos ^2 \theta-\sin ^2 \theta$<br>
$\cos (2 \theta) =2 \cos ^2 \theta-1$<br>
$\cos (2 \theta) =1-2 \sin ^2 \theta$<br>

### Product to sum
$\sin \alpha \sin \beta=\frac{1}{2}[\cos (\alpha-\beta)-\cos (\alpha+\beta)]$<br>
$\cos \alpha \cos \beta=\frac{1}{2}[\cos (\alpha-\beta)+\cos (\alpha+\beta)]$<br>
$\sin \alpha \cos \beta=\frac{1}{2}[\sin (\alpha+\beta)+\sin (\alpha-\beta)]$<br>
$\cos \alpha \sin \beta=\frac{1}{2}[\sin (\alpha+\beta)-\sin (\alpha-\beta)]$<br>

### Weird ones
$\sec ^2 \theta=1+\tan ^2 \theta$

$\sin 3 \theta  =3 \sin \theta-4 \sin ^3 \theta$<br>
$\cos 3 \theta  =4 \cos ^3 \theta-3 \cos \theta$<br>
$\tan 3 \theta  =\frac{3 \tan \theta-\tan ^3 \theta}{1-3 \tan ^2 \theta}$

## Limits
### Definition
$\lim _{x \rightarrow a} f(x)=L$ if:<br> 
For every $\varepsilon>0$ there exists a $\delta>0$ such that if $0<|x-a|<\delta$ then:<br>
$|f(x)-L|<\varepsilon$<br>

### Properties
$\lim _{x \rightarrow a} c=c$<br>
$\lim _{x \rightarrow a} x=a$<br>

Let $\lim _{x \rightarrow a} f(x)=L$ and $\lim _{x \rightarrow a} g(x)=M$ then:<br>
- $\lim _{x \rightarrow a} cf(x) = cL$<br> 
- $\lim _{x \rightarrow a} [f(x) \pm g(x)]=L \pm M$<br>
- $\lim _{x \rightarrow a} [f(x) g(x)]=L M$<br>
- $\lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\frac{L}{M}$ if $M \neq 0$<br>
- $\lim _{x \rightarrow a} [f(x)]^n=L^n$<br>


### Common limits
$\lim _{x \rightarrow 0} \frac{\sin x}{x}=1$<br>
$\lim _{x \rightarrow 0} \frac{1-\cos x}{x}=0$<br>
$\lim _{x \rightarrow 0} \frac{\tan x}{x}=1$<br>
$\lim _{x \rightarrow 0} \frac{\arcsin x}{x}=1$<br>
$\lim _{x \rightarrow 0} \frac{\arctan x}{x}=1$<br>
$\lim _{x \rightarrow 0} \frac{e^x-1}{x}=1$<br>
$\lim _{x \rightarrow 0} \frac{a^x-1}{x}=\ln a$<br>
$\lim _{x \rightarrow 0} \frac{\sinh x}{x}=1$<br>
$\lim _{x \rightarrow 0} \frac{\cosh x-1}{x}=0$<br>
$\lim _{x \rightarrow 0} \frac{\tanh x}{x}=1$<br>
$\lim _{x \rightarrow \infty} \frac{\ln x}{x}=0$<br>
$\lim _{x \rightarrow 0} \frac{\ln (1+x)}{x}=1$<br>
$\lim _{x \rightarrow \infty} e^{-x}=0$<br>
$\lim _{x \rightarrow \infty} (1 + \frac{1}{x})^x=e$<br>
$\lim _{x \rightarrow \infty} (1 + \frac{k}{x})^x=e^k$<br>
$\lim _{x \rightarrow 0} (1 + x)^{\frac{1}{x}}=e$<br>

## Continuity
### Definition
$f$ is continuous at $x=a$ if:<br>
$\lim _{x \rightarrow a} f(x)=f(a)$<br>

### Strict definition

$f$ is continuous at $x=a$ if:<br>
$(\forall \varepsilon>0) (\exists \delta>0) (\forall x \in D(f)):$<br>
$|x-a|<\delta \Rightarrow|f(x)-f(a)|<\varepsilon$<br>

### Properties
If $f$ and $g$ are continuous at $x=a$ then:<br>
- $f+g$ is continuous at $x=a$<br>
- $f-g$ is continuous at $x=a$<br>
- $f \cdot g$ is continuous at $x=a$<br>
- $\frac{f}{g}$ is continuous at $x=a$ if $g(a) \neq 0$<br>

## Intermediate value theorem
If $f$ is continuous on $[a, b]$ and let $M$ be any number between $f(a)$ and $f(b)$ then there exists a number $c$ in $[a, b]$ such that $f(c)=M$<br>

## Derivatives
### Definition
$\frac{d}{d x} f(x)=\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}$<br>

### Critical points
$X = c$ is a critical point of $f$ if:
- $f'(c) = 0$
- $f'(c)$ is undefined

### Concavity
$f$ is convex on $I$ if $f''(x) > 0$ for all $x \in I$<br>
$f$ is concave on $I$ if $f''(x) < 0$ for all $x \in I$<br>
### Inflection points
$X = c$ is an inflection point of $f$ if the concavity of $f$ changes at $c$<br>

### Common derivatives

$1.\frac{d}{d x} \sin x=\cos x$<br>
$2.\frac{d}{d x} \cos x=-\sin x$<br>
$3.\frac{d}{d x} \tan x=\sec ^2 x$<br>
$4.\frac{d}{d x} \cot x=-\csc ^2 x$<br>
$5.\frac{d}{d x} \sec x=\sec x \tan x$<br>
$6.\frac{d}{d x} \csc x=-\csc x \cot x$<br>
$7.\frac{d}{d x} \arcsin x=\frac{1}{\sqrt{1-x^2}}$<br>
$8.\frac{d}{d x} \arccos x=-\frac{1}{\sqrt{1-x^2}}$<br>
$9.\frac{d}{d x} \arctan x=\frac{1}{1+x^2}$<br>
$10.\frac{d}{d x} \operatorname{arccot} x=-\frac{1}{1+x^2}$<br>
$11.\frac{d}{d x} \sinh x=\cosh x$<br>
$12.\frac{d}{d x} \cosh x=\sinh x$<br>
$13.\frac{d}{d x} \tanh x=\operatorname{sech}^2 x$<br>
$14.\frac{d}{d x} \operatorname{coth} x=-\operatorname{csch}^2 x$<br>
$15.\frac{d}{d x} \log _a x=\frac{1}{x \ln a}$<br>
$16.\frac{d}{d x} a^x=a^x \ln a$<br>

## Rolle's theorem
If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$ and $f(a)=f(b)$ then there exists a number $c$ in $(a, b)$ such that $f'(c)=0$<br>

## Mean value theorem
If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$ then there exists a number $c$ in $(a, b)$ such that $f'(c)=\frac{f(b)-f(a)}{b-a}$<br>

## Extreme value theorem
If $f$ is continuous on $[a, b]$ then $f$ attains an absolute maximum and an absolute minimum on $[a, b]$<br>

To find the absolute maximum and minimum of $f$ on $[a, b]$:<br>
1. Find the critical points of $f$ in $(a, b)$<br>
2. Evaluate $f$ at the critical points and at the endpoints of $[a, b]$<br>
3. The largest value is the absolute maximum and the smallest value is the absolute minimum<br>

## L'Hôpital's rule
If $\lim _{x \rightarrow a} f(x)=\lim _{x \rightarrow a} g(x)=0$ or $\lim _{x \rightarrow a} f(x)=\lim _{x \rightarrow a} g(x)=\pm \infty$ and $\lim _{x \rightarrow a} \frac{f'(x)}{g'(x)}$ exists then:<br>
$\lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\lim _{x \rightarrow a} \frac{f'(x)}{g'(x)}$<br>

## Taylor series
$f(x)=\sum _{n=0}^{\infty} \frac{f^{(n)}(a)}{n !}(x-a)^n$<br>

## Maclaurin series
The Maclaurin series is a Taylor series centered at $a=0$<br>
$f(x)=\sum _{n=0}^{\infty} \frac{f^{(n)}(0)}{n !} x^n$<br>

### Common Maclaurin series
$1.\sin x=\sum _{n=0}^{\infty} \frac{(-1)^n}{(2 n+1) !} x^{2 n+1}$<br>
$2.\cos x=\sum _{n=0}^{\infty} \frac{(-1)^n}{(2 n) !} x^{2 n}$<br>
$3.e^x=\sum _{n=0}^{\infty} \frac{1}{n !} x^n$<br>
$4.\ln (1+x)=\sum _{n=1}^{\infty} \frac{(-1)^{n+1}}{n} x^n$<br>
$5.\frac{1}{1-x}=\sum _{n=0}^{\infty} x^n$<br>
$6.\frac{1}{1+x}=\sum _{n=0}^{\infty}(-1)^n x^n$<br>
$7.-\ln (1-x)=\sum _{n=1}^{\infty} \frac{x^n}{n}$<br>
$8.\tan ^{-1} x=\sum _{n=0}^{\infty} \frac{(-1)^n}{2 n+1} x^{2 n+1}$<br>
$9.\sinh x=\sum _{n=0}^{\infty} \frac{x^{2 n+1}}{(2 n+1) !}$<br>
$10.\cosh x=\sum _{n=0}^{\infty} \frac{x^{2 n}}{(2 n) !}$<br>
$11.(1+x)^p=\sum _{n=0}^{\infty} \frac{p(p-1) \ldots(p-n+1)}{n !} x^n$<br>

## Series of real numbers
### Definition
A series of real numbers is an expression of the form:<br>
$a_1+a_2+a_3+\ldots=\sum _{n=1}^{\infty} a_n$<br>
where $\{a_n\}$ is a sequence of real numbers<br>

$\sum _{n=1}^{\infty} a_n = \lim _{n \rightarrow \infty} s_n$<br>
$s_n = \sum _{k=1}^{n} a_k$<br>

### Convergence
A series $\sum _{n=1}^{\infty} a_n$ converges if $\lim _{n \rightarrow \infty} s_n$ exists<br>

### Necessary condition for convergence
$\lim _{n \rightarrow \infty} a_n = 0$<br>

## Convergence tests
### Comparison test
If $\sum _{n=1}^{\infty} a_n$ and $\sum _{n=1}^{\infty} b_n$ are series with positive terms and $a_n \leq b_n$ for all $n$ then:<br>
- If $\sum _{n=1}^{\infty} b_n$ converges then $\sum _{n=1}^{\infty} a_n$ converges<br>
- If $\sum _{n=1}^{\infty} a_n$ diverges then $\sum _{n=1}^{\infty} b_n$ diverges<br>

### D'Alembert's ratio test
If $\lim _{n \rightarrow \infty} \frac{a_{n+1}}{a_n}=L$ then:<br>
- If $L<1$ then $\sum _{n=1}^{\infty} a_n$ converges<br>
- If $L>1$ then $\sum _{n=1}^{\infty} a_n$ diverges<br>

### Cauchy's root test
If $\lim _{n \rightarrow \infty} \sqrt[n]{|a_n|}=L$ then:<br>
- If $L<1$ then $\sum _{n=1}^{\infty} a_n$ converges<br>
- If $L>1$ then $\sum _{n=1}^{\infty} a_n$ diverges<br>

### Integral test
If $f$ is a continuous, positive, decreasing function on $[1, \infty)$ and $a_n=f(n)$ then:<br>
$\int _{1}^{\infty} f(x) d x$ converges if and only if $\sum _{n=1}^{\infty} a_n$ converges<br>

### Alternating series
An alternating series is a series of the form:<br>
$a_1-a_2+a_3-\ldots=\sum _{n=1}^{\infty} (-1)^{n+1} a_n$<br>
where $\{a_n\}$ is a sequence of positive real numbers<br>

### Alternating series test (Leibniz's test)
If $\{a_n\}$ is a sequence of positive real numbers such that:<br>
- $a_{n+1} \leq a_n$ for all $n$<br>
- $\lim _{n \rightarrow \infty} a_n = 0$<br>

then: $\sum _{n=1}^{\infty} (-1)^{n+1} a_n$ converges<br>

### Dirichlet's test
If $\{a_n\}$ and $\{b_n\}$ are sequences such that:<br>
- $\{a_n\}$ is a decreasing sequence of positive real numbers<br>
- $\lim _{n \rightarrow \infty} a_n = 0$<br>
- $\sum _{n=1}^{\infty} b_n$ is bounded<br>
    
    then: $\sum _{n=1}^{\infty} a_n b_n$ converges<br>

### Abel's test
Suppose the sequence $\{a_n\}$ is monotonic and the series $\sum _{n=1}^{\infty} b_n$ converges. Then the series $\sum _{n=1}^{\infty} a_n b_n$ converges.<br>

### Absolute convergence
A series $\sum _{n=1}^{\infty} a_n$ converges absolutely if $\sum _{n=1}^{\infty} |a_n|$ converges<br>

### Theorem
**Every absolutely convergent series converges**<br>

### Conditional convergence
A series $\sum _{n=1}^{\infty} a_n$ converges conditionally if it converges but does not converge absolutely<br>

## Power series
$\sum _{n=0}^{\infty} a_n (x-x_0)^n$<br>

### Radius of convergence
$R=\frac{1}{\lim _{n \rightarrow \infty} \sqrt[n]{|a_n|}}$<br>

### Interval of convergence
$[a-R, a+R]$<br>

### Theorems to check for convergence
1. If $\lim _{n \rightarrow \infty} \sqrt[n]{|a_n|}=L$ then the radius of convergence is $R=\frac{1}{L}$<br>
2. If $\lim _{n \rightarrow \infty} \frac{|a_{n+1}|}{|a_n|}=L$ then the radius of convergence is $R=\frac{1}{L}$<br>

### Differentiation and integration
A power series can be differentiated and integrated term by term.<br>

$\frac{d}{d x} \sum _{n=0}^{\infty} a_n (x-x_0)^n=\sum _{n=1}^{\infty} n a_n (x-x_0)^{n-1}$<br><br>
$\int \sum _{n=0}^{\infty} a_n (x-x_0)^n d x=\sum _{n=0}^{\infty} \frac{a_n}{n+1} (x-x_0)^{n+1}+C$<br>

The radius of convergence of the differentiated or integrated series is the same as the original series.<br>


## Integrals
### Definition
$\int f(x) d x=F(x)+C$<br>

### Integral by parts
$\int u \ dv=u v-\int v \ du$<br>

### Basic forms
$\int x^n d x=\frac{x^{n+1}}{n+1}+C$<br>
$\int \frac{1}{ax + b} d x=\frac{1}{a} \ln |ax+b|+C$<br>

### Differential of an Integral

$\frac{\mathrm{d}}{\mathrm{d} \alpha} \int_{a(\alpha)}^{b(\alpha)} f(x, \alpha) \mathrm{d}x=f(b,\alpha) \frac{\mathrm{d} b}{\mathrm{d} \alpha} - f(a,\alpha) \frac{\mathrm{d} a}{\mathrm{d} \alpha} + \int_{a(\alpha)}^{b(\alpha)} \frac{\partial}{\partial{\alpha}} f(x, \alpha) \mathrm{d}x$

### Common integrals

$1.\int x^n d x=\frac{x^{n+1}}{n+1}+C$<br>
$2.\int \frac{1}{x} d x=\ln |x|+C$<br>
$3.\int_{}^{} e^{ax} \mathrm{d}x=\frac{1}{a}e^{ax} + c$<br>
$4.\int a^x d x=\frac{a^x}{\ln a}+C$<br>
$5.\int \ln x d x=x \ln x-x+C$<br>
$6.\int \sin x d x=-\cos x+C$<br>
$7.\int \cos x d x=\sin x+C$<br>
$8.\int \tan x d x=-\ln |\cos x|+C$<br>
$9.\int \cot x d x=\ln |\sin x|+C$<br>
$10.\int \sec x d x=\ln |\sec x+\tan x|+C$<br>
$11.\int \sec ^2 x d x=\tan x+C$<br>
$12.\int \csc ^2 x d x=-\cot x+C$<br>
$13.\int \sec x \tan x d x=\sec x+C$<br>
$14.\int \frac{1}{\sqrt{a^2-x^2}} d x=\arcsin \frac{x}{a}+C$<br>
$15.\int \frac{1}{a^2+x^2} d x=\frac{1}{a} \arctan \frac{x}{a}+C$<br>
$16.\int \frac{1}{x \sqrt{x^2-a^2}} d x=\frac{1}{a} \operatorname{arcsec} \frac{|x|}{a}+C$<br>
$17.\int \frac{1}{\sqrt{x^2+a^2}} d x=\ln \left|x+\sqrt{x^2+a^2}\right|+C$<br>
$18.\int \frac{1}{\sqrt{x^2-a^2}} d x=\ln \left|x+\sqrt{x^2-a^2}\right|+C$<br>
$19.\int \frac{1}{a^2-x^2} d x=\frac{1}{2 a} \ln \left|\frac{a+x}{a-x}\right|+C$<br>

