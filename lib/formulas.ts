export type FormulaCategory =
  | "高等数学与优化"
  | "线性代数"
  | "概率论与统计"
  | "经典机器学习（ESL）"
  | "神经网络与深度学习"
  | "大模型 · MoE · 训练推理"
  | "强化学习与马尔可夫过程";

export type VisualKind =
  | "curve"
  | "matrix"
  | "distribution"
  | "regression"
  | "activation"
  | "attention"
  | "moe"
  | "markov"
  | "optimization"
  | "generic";

export interface FormulaVariable {
  symbol: string;
  meaning: string;
  operation: string;
}

export interface DerivationStep {
  formula: string;
  note: string;
}

export interface FormulaSource {
  label: string;
  href: string;
}

export interface FormulaEntry {
  id: string;
  title: string;
  category: FormulaCategory;
  topic: string;
  latex: string;
  explanation: string;
  nature: "推导" | "定义/构造";
  variables: FormulaVariable[];
  derivation: DerivationStep[];
  example: { setup: string; work: string[]; answer: string };
  sources: FormulaSource[];
  tags: string[];
  visual: VisualKind;
}

const V = (symbol: string, meaning: string, operation: string): FormulaVariable => ({ symbol, meaning, operation });
const D = (formula: string, note: string): DerivationStep => ({ formula, note });
const E = (setup: string, work: string[], answer: string) => ({ setup, work, answer });
const PPT = (slide: number): FormulaSource => ({
  label: `课程 PPT · 第 ${slide} 页`,
  href: "#sources",
});
const ESL = (chapter: string, path: string): FormulaSource => ({
  label: `ESL-CN · ${chapter}`,
  href: `https://github.com/McZyWu/ESL-CN/tree/master/docs/${path}`,
});
const STD = (label = "标准数学/算法推导"): FormulaSource => ({ label, href: "#sources" });

export const categories: FormulaCategory[] = [
  "高等数学与优化",
  "线性代数",
  "概率论与统计",
  "经典机器学习（ESL）",
  "神经网络与深度学习",
  "大模型 · MoE · 训练推理",
  "强化学习与马尔可夫过程",
];

const foundationFormulas: FormulaEntry[] = [
  {
    id: "limit-definition", title: "极限的 ε–δ 定义", category: "高等数学与优化", topic: "极限与连续",
    latex: "\\lim_{x\\to a}f(x)=L\\iff\\forall\\varepsilon>0,\\exists\\delta>0:0<|x-a|<\\delta\\Rightarrow|f(x)-L|<\\varepsilon",
    explanation: "用任意小的输出误差 ε 反推允许的输入误差 δ；它是导数、连续性和积分的逻辑起点。", nature: "定义/构造",
    variables: [V("x","自变量","向 a 靠近但不等于 a"),V("a","趋近点","固定比较中心"),V("L","候选极限","与 f(x) 比较"),V("\\varepsilon,\\delta","输出/输入容差","先给 ε，再构造 δ")],
    derivation: [D("|f(x)-L|<\\varepsilon","先规定输出必须进入 L 的 ε 邻域。"),D("0<|x-a|<\\delta","寻找一个输入邻域，使其中所有 x 都满足输出要求。"),D("\\forall\\varepsilon>0\\;\\exists\\delta>0","若任意精度都能做到，就把 L 定义为极限。")],
    example: E("证明 lim(x→2) 3x=6",["|3x-6|=3|x-2|","取 δ=ε/3，则 |x-2|<δ ⇒ |3x-6|<ε"],"极限为 6"), sources:[STD()], tags:["高数","极限"], visual:"curve",
  },
  {
    id:"derivative-definition",title:"导数定义",category:"高等数学与优化",topic:"微分",
    latex:"f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}",explanation:"把两点割线斜率的间隔 h 压到 0，得到切线瞬时变化率。",nature:"定义/构造",
    variables:[V("f","标量函数","把输入映射到输出"),V("x","求导位置","固定基点"),V("h","微小增量","令 h→0"),V("f'(x)","局部斜率","差商的极限")],
    derivation:[D("m_h=\\frac{f(x+h)-f(x)}{(x+h)-x}","先写两个点之间的割线斜率。"),D("m_h=\\frac{f(x+h)-f(x)}{h}","化简横坐标差。"),D("f'(x)=\\lim_{h\\to0}m_h","让第二个点贴近第一个点，割线趋于切线。")],
    example:E("f(x)=x²，在 x=3 求导",["[(3+h)²-9]/h=(6h+h²)/h","令 h→0，得到 6+h→6"],"f'(3)=6"),sources:[STD()],tags:["导数","梯度"],visual:"curve",
  },
  {
    id:"product-rule",title:"乘积求导法则",category:"高等数学与优化",topic:"微分",
    latex:"(fg)'=f'g+fg'",explanation:"乘积变化由“f 变而 g 暂不变”和“g 变而 f 暂不变”两部分组成。",nature:"推导",
    variables:[V("f,g","两个可导函数","逐点相乘"),V("f',g'","各自导数","分别计算局部变化")],
    derivation:[D("\\frac{f(x+h)g(x+h)-f(x)g(x)}h","从乘积的差商出发。"),D("\\frac{[f(x+h)-f(x)]g(x+h)}h+f(x)\\frac{g(x+h)-g(x)}h","加减 f(x)g(x+h) 并分组。"),D("f'(x)g(x)+f(x)g'(x)","令 h→0，利用连续性 g(x+h)→g(x)。")],
    example:E("f=x²，g=sin x",["f'=2x，g'=cos x","(x²sin x)'=2x sin x+x²cos x"],"2x sin x+x²cos x"),sources:[STD()],tags:["导数"],visual:"generic",
  },
  {
    id:"chain-rule",title:"链式法则",category:"高等数学与优化",topic:"微分",
    latex:"\\frac{d}{dx}f(g(x))=f'(g(x))g'(x)",explanation:"复合函数的变化率等于外层对内层输出的变化率，乘以内层对输入的变化率。",nature:"推导",
    variables:[V("x","原始输入","先送入 g"),V("g","内层函数","x↦u"),V("f","外层函数","u↦y"),V("u","中间变量","连接两层")],
    derivation:[D("\\frac{dy}{dx}=\\lim_{\\Delta x\\to0}\\frac{\\Delta y}{\\Delta x}","写总变化率。"),D("\\frac{\\Delta y}{\\Delta x}=\\frac{\\Delta y}{\\Delta u}\\frac{\\Delta u}{\\Delta x}","乘除中间增量 Δu。"),D("\\frac{dy}{dx}=\\frac{dy}{du}\\frac{du}{dx}=f'(g(x))g'(x)","分别取极限。")],
    example:E("y=(3x+1)²",["外层 f(u)=u²，f'=2u","内层 g=3x+1，g'=3","y'=2(3x+1)·3"],"y'=6(3x+1)"),sources:[STD()],tags:["导数","反向传播"],visual:"curve",
  },
  {
    id:"gradient",title:"梯度",category:"高等数学与优化",topic:"多元微分",
    latex:"\\nabla f(\\mathbf x)=\\begin{bmatrix}\\partial f/\\partial x_1&\\cdots&\\partial f/\\partial x_n\\end{bmatrix}^{\\!T}",explanation:"梯度收集各坐标方向的偏导，并指向函数增长最快的方向。",nature:"定义/构造",
    variables:[V("f","多元标量函数","输入向量，输出一个数"),V("\\mathbf x","n 维输入","由 x₁…xₙ 组成"),V("\\partial f/\\partial x_i","第 i 个偏导","其余变量固定时求导"),V("\\nabla f","梯度向量","把全部偏导堆叠")],
    derivation:[D("f(\\mathbf x+\\Delta\\mathbf x)\\approx f(\\mathbf x)+\\sum_i\\frac{\\partial f}{\\partial x_i}\\Delta x_i","一阶泰勒展开。"),D("\\Delta f\\approx\\nabla f(\\mathbf x)^T\\Delta\\mathbf x","把求和写成点积。"),D("\\max_{\\|\\Delta\\mathbf x\\|=1}\\Delta f=\\|\\nabla f\\|","由柯西不等式，最大值在 Δx 与梯度同向时取得。")],
    example:E("f(x,y)=x²+3y²，点 (1,2)",["∂f/∂x=2x，∂f/∂y=6y","代入得到 [2,12]ᵀ"],"最陡上升方向为 [2,12]ᵀ"),sources:[STD()],tags:["梯度","优化"],visual:"optimization",
  },
  {
    id:"jacobian",title:"雅可比矩阵",category:"高等数学与优化",topic:"多元微分",
    latex:"J_{ij}=\\frac{\\partial f_i}{\\partial x_j}",explanation:"向量函数对向量输入的一阶导数；每一行描述一个输出对所有输入的敏感度。",nature:"定义/构造",
    variables:[V("\\mathbf f","m 维输出函数","f₁…fₘ"),V("\\mathbf x","n 维输入","x₁…xₙ"),V("J","m×n 雅可比矩阵","按输出行、输入列排列")],
    derivation:[D("f_i(\\mathbf x+\\Delta\\mathbf x)\\approx f_i(\\mathbf x)+\\sum_j\\frac{\\partial f_i}{\\partial x_j}\\Delta x_j","对每个输出做一阶展开。"),D("\\Delta\\mathbf f\\approx J\\Delta\\mathbf x","把 m 条线性近似堆叠成矩阵。")],
    example:E("f=[x²+y, xy]，在 (1,2)",["J=[[2x,1],[y,x]]","代入 (1,2) 得 [[2,1],[2,1]]"],"J=[[2,1],[2,1]]"),sources:[STD()],tags:["雅可比","反向传播"],visual:"matrix",
  },
  {
    id:"hessian",title:"海森矩阵",category:"高等数学与优化",topic:"二阶微分",
    latex:"H_{ij}=\\frac{\\partial^2 f}{\\partial x_i\\partial x_j}",explanation:"梯度的雅可比矩阵，描述曲率；正定意味着局部像碗，负定意味着像山顶。",nature:"定义/构造",
    variables:[V("f","二阶可导标量函数","对输入输出损失"),V("H","n×n 曲率矩阵","再对梯度求导"),V("H_{ij}","混合二阶偏导","先后对 xⱼ、xᵢ 求导")],
    derivation:[D("\\nabla f(\\mathbf x+\\Delta)\\approx\\nabla f(\\mathbf x)+H\\Delta","对梯度做一阶展开。"),D("f(\\mathbf x+\\Delta)\\approx f(\\mathbf x)+\\nabla f^T\\Delta+\\tfrac12\\Delta^TH\\Delta","积分一次得到二阶泰勒式。")],
    example:E("f=x²+xy+2y²",["∇f=[2x+y,x+4y]","再求偏导 H=[[2,1],[1,4]]"],"H 的特征值均正，f 严格凸"),sources:[STD()],tags:["二阶优化","曲率"],visual:"optimization",
  },
  {
    id:"taylor",title:"多元泰勒展开",category:"高等数学与优化",topic:"近似",
    latex:"f(\\mathbf x+\\Delta)\\approx f(\\mathbf x)+\\nabla f^T\\Delta+\\frac12\\Delta^TH\\Delta",explanation:"用局部的值、斜率和曲率近似邻域中的函数，是优化算法的统一视角。",nature:"推导",
    variables:[V("\\Delta","输入位移","从 x 走到 x+Δ"),V("\\nabla f","一阶变化","与 Δ 做点积"),V("H","二阶曲率","形成二次型")],
    derivation:[D("g(t)=f(\\mathbf x+t\\Delta)","把多元问题限制在一条直线上。"),D("g(1)=g(0)+g'(0)+\\tfrac12g''(0)+R_3","对单变量 g 做泰勒展开。"),D("g'(0)=\\nabla f^T\\Delta,\\quad g''(0)=\\Delta^TH\\Delta","用链式法则展开方向导数。")],
    example:E("f(x)=eˣ，在 0 附近",["f(0)=f'(0)=f''(0)=1","eˣ≈1+x+x²/2"],"x=0.1 时近似 1.105，真值约 1.10517"),sources:[STD()],tags:["泰勒","近似"],visual:"curve",
  },
  {
    id:"fundamental-calculus",title:"微积分基本定理",category:"高等数学与优化",topic:"积分",
    latex:"\\frac{d}{dx}\\int_a^x f(t)\\,dt=f(x)",explanation:"累计面积的瞬时增长率就是边界处的函数高度，把微分与积分连接起来。",nature:"推导",
    variables:[V("a","固定下限","累计起点"),V("x","可变上限","决定累计区间"),V("t","积分哑变量","在区间内扫描"),V("f","被积函数","面积的高度")],
    derivation:[D("F(x+h)-F(x)=\\int_x^{x+h}f(t)dt","两个累计面积相减只剩窄条。"),D("\\frac{F(x+h)-F(x)}h=\\frac1h\\int_x^{x+h}f(t)dt","除以宽度得到窄条平均高度。"),D("F'(x)=f(x)","h→0 且 f 连续时，平均高度趋于边界高度。")],
    example:E("F(x)=∫₀ˣ 2t dt",["积分得 F=x²","再求导 F'=2x"],"与被积函数 2x 相同"),sources:[STD()],tags:["积分"],visual:"curve",
  },
  {
    id:"lagrange",title:"拉格朗日乘子",category:"高等数学与优化",topic:"约束优化",
    latex:"\\mathcal L(\\mathbf x,\\lambda)=f(\\mathbf x)+\\lambda g(\\mathbf x),\\quad\\nabla f=-\\lambda\\nabla g",explanation:"在约束曲面上无法继续下降时，目标梯度必须与约束法向量平行。",nature:"推导",
    variables:[V("f","目标函数","希望最小/最大"),V("g=0","等式约束","限定可行面"),V("\\lambda","乘子","平衡目标与约束"),V("\\mathcal L","拉格朗日函数","把约束并入目标")],
    derivation:[D("\\nabla g^T\\Delta\\mathbf x=0","可行方向必须与约束法向量正交。"),D("\\nabla f^T\\Delta\\mathbf x=0","最优点沿所有可行方向的一阶变化也为零。"),D("\\nabla f+\\lambda\\nabla g=0","两梯度共享同一法向空间，因此线性相关。")],
    example:E("最小化 x²+y²，约束 x+y=1",["L=x²+y²+λ(x+y-1)","2x+λ=0，2y+λ=0 ⇒ x=y","代入约束 x=y=1/2"],"最小值 1/2"),sources:[STD()],tags:["约束优化"],visual:"optimization",
  },
  {
    id:"gradient-descent",title:"梯度下降",category:"高等数学与优化",topic:"一阶优化",
    latex:"\\boldsymbol\\theta_{t+1}=\\boldsymbol\\theta_t-\\eta\\nabla_\\theta L(\\boldsymbol\\theta_t)",explanation:"每一步沿损失最陡上升方向的反方向移动；学习率 η 控制步长。",nature:"推导",
    variables:[V("\\theta_t","第 t 步参数","当前模型状态"),V("L","损失函数","衡量误差"),V("\\eta","学习率","缩放更新长度"),V("\\nabla L","损失梯度","给出最陡上升方向")],
    derivation:[D("L(\\theta+\\Delta)\\approx L(\\theta)+\\nabla L^T\\Delta","一阶泰勒近似。"),D("\\min_{\\|\\Delta\\|\\le r}\\nabla L^T\\Delta","在给定步长内寻找最大下降。"),D("\\Delta=-\\eta\\nabla L","由柯西不等式，最优方向与梯度相反。")],
    example:E("L(θ)=(θ-3)²，θ₀=0，η=0.1",["梯度 2(θ-3)，初值为 -6","θ₁=0-0.1(-6)=0.6","θ₂=0.6-0.1(-4.8)=1.08"],"参数逐步靠近 3"),sources:[STD()],tags:["训练","梯度"],visual:"optimization",
  },
  {
    id:"newton-method",title:"牛顿法",category:"高等数学与优化",topic:"二阶优化",
    latex:"\\boldsymbol\\theta_{t+1}=\\boldsymbol\\theta_t-H^{-1}\\nabla L",explanation:"用局部二次曲率校正每个方向的步长；接近最优点时通常比梯度下降更快。",nature:"推导",
    variables:[V("H","损失的海森矩阵","描述各方向曲率"),V("H^{-1}","逆曲率","缩放梯度"),V("\\nabla L","一阶误差","指示局部斜率")],
    derivation:[D("L(\\theta+\\Delta)\\approx L+g^T\\Delta+\\tfrac12\\Delta^TH\\Delta","建立局部二次模型。"),D("\\nabla_\\Delta L\\approx g+H\\Delta=0","令近似模型梯度为零。"),D("\\Delta=-H^{-1}g","解线性方程得到牛顿步。")],
    example:E("L(θ)=(θ-4)²",["g=2(θ-4)，H=2","θ₁=θ-g/H=4"],"对二次函数一步到最优点"),sources:[STD()],tags:["二阶优化"],visual:"optimization",
  },
  {
    id:"adam",title:"Adam 优化器",category:"高等数学与优化",topic:"自适应优化",
    latex:"m_t=\\beta_1m_{t-1}+(1-\\beta_1)g_t,\\;v_t=\\beta_2v_{t-1}+(1-\\beta_2)g_t^2,\\;\\theta_t=\\theta_{t-1}-\\eta\\frac{\\hat m_t}{\\sqrt{\\hat v_t}+\\epsilon}",explanation:"用梯度的一阶矩估计方向、二阶矩估计尺度，并用偏差修正处理冷启动。",nature:"推导",
    variables:[V("g_t","当前梯度","对参数求偏导"),V("m_t,v_t","一/二阶指数均值","平滑梯度与平方梯度"),V("\\beta_1,\\beta_2","衰减率","控制历史权重"),V("\\hat m_t,\\hat v_t","偏差修正矩","分别除以 1-βᵗ"),V("\\epsilon","稳定项","避免除零")],
    derivation:[D("m_t=(1-\\beta_1)\\sum_{i=1}^t\\beta_1^{t-i}g_i","展开递推可见它是指数加权均值。"),D("E[m_t]=(1-\\beta_1^t)E[g]","初始 m₀=0 导致向零偏。"),D("\\hat m_t=m_t/(1-\\beta_1^t)","除去偏差；v 同理。"),D("\\Delta\\theta=-\\eta\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)","按每个坐标的历史尺度归一化更新。")],
    example:E("g₁=2，β₁=0.9，β₂=0.999",["m₁=0.2，v₁=0.004","m̂₁=2，v̂₁=4","首步约为 -η·2/2=-η"],"偏差修正后首步不过小"),sources:[STD()],tags:["Adam","训练"],visual:"optimization",
  },

  {
    id:"matrix-multiplication",title:"矩阵乘法",category:"线性代数",topic:"矩阵运算",
    latex:"C=AB,\\qquad C_{ij}=\\sum_{k=1}^{p}A_{ik}B_{kj}",explanation:"输出的第 i 行第 j 列，是 A 的第 i 行与 B 的第 j 列的点积。",nature:"定义/构造",
    variables:[V("A","m×p 矩阵","提供行向量"),V("B","p×n 矩阵","提供列向量"),V("C","m×n 结果","收集所有行列点积"),V("k","共享维索引","逐项相乘后求和")],
    derivation:[D("B\\mathbf e_j=\\mathbf b_j","用标准基 eⱼ 取出 B 的第 j 列。"),D("AB\\mathbf e_j=A\\mathbf b_j","复合线性映射先做 B 再做 A。"),D("(AB)_{ij}=\\mathbf a_i^T\\mathbf b_j=\\sum_kA_{ik}B_{kj}","取结果第 i 个分量。")],
    example:E("A=[[1,2],[3,4]]，B=[[5],[6]]",["C₁₁=1·5+2·6=17","C₂₁=3·5+4·6=39"],"C=[[17],[39]]"),sources:[PPT(4)],tags:["PPT必含","矩阵"],visual:"matrix",
  },
  {
    id:"transpose",title:"转置与乘积转置",category:"线性代数",topic:"矩阵运算",
    latex:"(A^T)_{ij}=A_{ji},\\qquad(AB)^T=B^TA^T",explanation:"转置交换行列；复合映射转置时顺序反转。",nature:"推导",
    variables:[V("A^T","A 的转置","把第 i 行变成第 i 列"),V("i,j","行列索引","转置时互换"),V("A,B","可相乘矩阵","乘积转置后倒序")],
    derivation:[D("[(AB)^T]_{ij}=(AB)_{ji}","按转置定义交换索引。"),D("(AB)_{ji}=\\sum_kA_{jk}B_{ki}","展开矩阵乘法。"),D("\\sum_k(B^T)_{ik}(A^T)_{kj}=(B^TA^T)_{ij}","把元素改写为转置元素。")],
    example:E("A 为 2×3，B 为 3×1",["AB 为 2×1，转置后 1×2","Bᵀ 为 1×3，Aᵀ 为 3×2，BᵀAᵀ 为 1×2"],"维度与元素都一致"),sources:[PPT(4),PPT(5)],tags:["PPT必含","转置"],visual:"matrix",
  },
  {
    id:"matrix-laws",title:"矩阵分配律与结合律",category:"线性代数",topic:"矩阵运算",
    latex:"A(B+C)=AB+AC,\\qquad A(BC)=(AB)C",explanation:"线性映射保持加法，函数复合保持结合；但一般 AB≠BA。",nature:"推导",
    variables:[V("A,B,C","维度兼容的矩阵","按行列规则相乘"),V("AB","先 B 后 A 的复合","顺序不可随意交换")],
    derivation:[D("[A(B+C)]_{ij}=\\sum_kA_{ik}(B_{kj}+C_{kj})","按元素展开。"),D("=\\sum_kA_{ik}B_{kj}+\\sum_kA_{ik}C_{kj}","标量乘法对加法分配。"),D("=[AB+AC]_{ij}","所有元素相等即矩阵相等。"),D("[A(BC)]_{ij}=\\sum_{k,l}A_{ik}B_{kl}C_{lj}=[(AB)C]_{ij}","有限求和可重新分组，得到结合律。")],
    example:E("A=[1,2]，B=[1,0]ᵀ，C=[0,1]ᵀ",["A(B+C)=3","AB+AC=1+2=3"],"分配律成立"),sources:[PPT(5)],tags:["PPT必含","矩阵"],visual:"matrix",
  },
  {
    id:"dot-product",title:"点积与夹角",category:"线性代数",topic:"向量",
    latex:"\\mathbf x^T\\mathbf y=\\sum_i x_iy_i=\\|\\mathbf x\\|_2\\|\\mathbf y\\|_2\\cos\\theta",explanation:"点积同时衡量逐坐标重合和几何方向一致性；为 0 时向量正交。",nature:"推导",
    variables:[V("\\mathbf x,\\mathbf y","同维向量","对应分量相乘后求和"),V("\\theta","两向量夹角","由余弦反解"),V("\\|\\cdot\\|_2","欧氏长度","平方和开根号")],
    derivation:[D("\\|x-y\\|_2^2=\\|x\\|^2+\\|y\\|^2-2x^Ty","展开平方范数。"),D("\\|x-y\\|_2^2=\\|x\\|^2+\\|y\\|^2-2\\|x\\|\\|y\\|\\cos\\theta","同一三角形使用余弦定理。"),D("x^Ty=\\|x\\|\\|y\\|\\cos\\theta","比较两式。")],
    example:E("x=[1,0]，y=[1,1]",["xᵀy=1","||x||=1，||y||=√2","cosθ=1/√2"],"θ=45°"),sources:[PPT(5),PPT(6)],tags:["PPT必含","向量"],visual:"matrix",
  },
  {
    id:"lp-norm",title:"Lₚ 范数",category:"线性代数",topic:"向量",
    latex:"\\|\\mathbf x\\|_p=\\left(\\sum_i|x_i|^p\\right)^{1/p}",explanation:"用 p 次幂聚合分量大小；p=1 强调稀疏，p=2 对应欧氏距离。",nature:"定义/构造",
    variables:[V("x_i","第 i 个分量","先取绝对值"),V("p","范数阶数","p≥1"),V("\\|x\\|_p","向量长度","求和后取 p 次根")],
    derivation:[D("|x_i|^p","消除符号并放大/压缩分量。"),D("S=\\sum_i|x_i|^p","聚合所有坐标贡献。"),D("\\|x\\|_p=S^{1/p}","用 p 次根恢复与原量同阶的尺度。")],
    example:E("x=[3,-4]",["||x||₁=3+4=7","||x||₂=√(9+16)=5"],"L₁=7，L₂=5"),sources:[PPT(6)],tags:["PPT必含","范数"],visual:"matrix",
  },
  {
    id:"orthogonal-matrix",title:"正交矩阵",category:"线性代数",topic:"矩阵结构",
    latex:"A^TA=AA^T=I\\quad\\Rightarrow\\quad A^{-1}=A^T",explanation:"列向量构成标准正交基，因此变换保持长度、夹角和体积绝对值。",nature:"推导",
    variables:[V("A","方阵","列为标准正交向量"),V("I","单位矩阵","对角为 1，其余为 0"),V("A^{-1}","逆矩阵","撤销 A 的变换")],
    derivation:[D("(A^TA)_{ij}=a_i^Ta_j","乘积元素是第 i、j 列的点积。"),D("a_i^Ta_j=\\delta_{ij}","标准正交列同列点积 1、异列 0。"),D("A^TA=I\\Rightarrow A^T=A^{-1}","按逆矩阵定义得到结论。")],
    example:E("二维旋转矩阵 R=[[cosθ,-sinθ],[sinθ,cosθ]]",["RᵀR 的对角为 cos²θ+sin²θ=1","非对角相消为 0"],"R⁻¹=Rᵀ=R(-θ)"),sources:[PPT(6)],tags:["PPT必含","正交"],visual:"matrix",
  },
  {
    id:"identity-inverse",title:"单位矩阵与逆矩阵",category:"线性代数",topic:"矩阵结构",
    latex:"I_dA=A,\\qquad A^{-1}A=AA^{-1}=I_d",explanation:"单位矩阵是不改变向量的线性映射；逆矩阵撤销可逆线性变换。",nature:"定义/构造",
    variables:[V("I_d","d×d 单位矩阵","对角元素 1"),V("A^{-1}","A 的逆","左右相乘都得到 I"),V("d","空间维数","决定方阵大小")],
    derivation:[D("(I_dA)_{ij}=\\sum_k\\delta_{ik}A_{kj}","展开矩阵乘法。"),D("(I_dA)_{ij}=A_{ij}","Kronecker δ 只保留 k=i 项。"),D("A^{-1}A=I_d","把撤销 A 的映射定义为 A⁻¹。")],
    example:E("A=[[2,0],[0,4]]",["A⁻¹=[[1/2,0],[0,1/4]]","A⁻¹A=I₂"],"逆变换把两轴缩放恢复"),sources:[PPT(5)],tags:["PPT必含","逆矩阵"],visual:"matrix",
  },
  {
    id:"linear-system",title:"线性方程组",category:"线性代数",topic:"线性系统",
    latex:"A\\mathbf x=\\mathbf b,\\qquad\\mathbf x=A^{-1}\\mathbf b\\;(A\\text{ 可逆})",explanation:"求一个输入 x，使线性变换 A 后得到目标 b；是否有解由秩与增广矩阵决定。",nature:"推导",
    variables:[V("A","系数矩阵","编码方程系数"),V("x","未知向量","要求解"),V("b","目标向量","方程右端"),V("A^{-1}","逆变换","仅 A 可逆时存在")],
    derivation:[D("Ax=b","原方程。"),D("A^{-1}Ax=A^{-1}b","两边左乘 A⁻¹。"),D("Ix=A^{-1}b","利用结合律和逆矩阵定义。")],
    example:E("2x=8",["A=[2]，A⁻¹=[1/2]","x=(1/2)·8=4"],"x=4"),sources:[PPT(7)],tags:["PPT必含","线性系统"],visual:"matrix",
  },
  {
    id:"trace",title:"矩阵的迹",category:"线性代数",topic:"矩阵不变量",
    latex:"\\operatorname{tr}(A)=\\sum_{i=1}^dA_{ii},\\qquad\\operatorname{tr}(AB)=\\operatorname{tr}(BA)",explanation:"迹是主对角线之和，也是特征值之和；循环不变性常用于矩阵求导。",nature:"推导",
    variables:[V("A_{ii}","第 i 个对角元素","沿主对角线求和"),V("d","方阵维数","决定求和范围"),V("tr","迹算子","把方阵映射为标量")],
    derivation:[D("\\operatorname{tr}(AB)=\\sum_i(AB)_{ii}","按迹定义。"),D("=\\sum_{i,j}A_{ij}B_{ji}","展开乘法。"),D("=\\sum_j(BA)_{jj}=\\operatorname{tr}(BA)","交换有限求和次序。")],
    example:E("A=[[1,2],[3,4]]",["tr(A)=1+4=5"],"迹为 5"),sources:[PPT(7)],tags:["PPT必含","迹"],visual:"matrix",
  },
  {
    id:"determinant",title:"行列式",category:"线性代数",topic:"矩阵不变量",
    latex:"\\det(A)=\\sum_{\\sigma\\in S_n}\\operatorname{sgn}(\\sigma)\\prod_iA_{i,\\sigma(i)}",explanation:"行列式给出线性变换的有向体积缩放；为 0 表示空间被压扁、矩阵不可逆。",nature:"定义/构造",
    variables:[V("S_n","n 元排列集合","枚举每行选一个不同列"),V("\\sigma","一个排列","指定列索引"),V("sgn(σ)","排列奇偶符号","偶排列 +1，奇排列 -1")],
    derivation:[D("\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc","二维面积由两条对角乘积之差给出。"),D("\\det(AB)=\\det(A)\\det(B)","连续两次体积缩放相乘。"),D("\\det(A)=0\\Leftrightarrow A\\text{ 不可逆}","体积压成零时存在非零向量映到零。")],
    example:E("A=[[2,1],[1,3]]",["det(A)=2·3-1·1=5"],"面积放大 5 倍且 A 可逆"),sources:[STD()],tags:["行列式"],visual:"matrix",
  },
  {
    id:"eigen",title:"特征值与特征向量",category:"线性代数",topic:"谱分解",
    latex:"A\\mathbf v=\\lambda\\mathbf v,\\qquad\\det(A-\\lambda I)=0",explanation:"特征向量经过 A 后方向不变，只被 λ 缩放；特征方程寻找使 A−λI 有非零零空间的 λ。",nature:"推导",
    variables:[V("A","方阵线性变换","作用于 v"),V("v","非零特征向量","方向保持"),V("λ","特征值","缩放倍数"),V("I","单位矩阵","把标量 λ 提升为矩阵")],
    derivation:[D("Av=\\lambda v","方向不变的要求。"),D("(A-\\lambda I)v=0","移项。"),D("v\\ne0\\Rightarrow A-\\lambda I\\text{ 不可逆}","齐次系统有非零解。"),D("\\det(A-\\lambda I)=0","不可逆等价于行列式为零。")],
    example:E("A=diag(2,3)",["det(A-λI)=(2-λ)(3-λ)=0","λ=2 对应 [1,0]，λ=3 对应 [0,1]"],"两坐标轴分别缩放 2、3 倍"),sources:[PPT(7)],tags:["PPT必含","特征值"],visual:"matrix",
  },
  {
    id:"eigendecomposition",title:"特征分解",category:"线性代数",topic:"谱分解",
    latex:"A=V\\operatorname{diag}(\\boldsymbol\\lambda)V^{-1}",explanation:"把变换分成“换到特征坐标 → 各轴独立缩放 → 换回原坐标”。",nature:"推导",
    variables:[V("V","特征向量矩阵","第 i 列为 vᵢ"),V("\\boldsymbol\\lambda","特征值向量","对角化为 Λ"),V("V^{-1}","坐标逆变换","回到原基")],
    derivation:[D("Av_i=\\lambda_iv_i","每个特征对满足定义。"),D("AV=V\\Lambda","把 n 个等式按列拼接。"),D("A=V\\Lambda V^{-1}","V 可逆时右乘 V⁻¹。")],
    example:E("A=diag(2,3)",["V=I，Λ=diag(2,3)","VΛV⁻¹=A"],"分解直接恢复 A"),sources:[PPT(7)],tags:["PPT必含","特征分解"],visual:"matrix",
  },
  {
    id:"positive-definite",title:"正定与半正定",category:"线性代数",topic:"矩阵结构",
    latex:"A\\succeq0\\iff\\mathbf x^TA\\mathbf x\\ge0\\;\\forall\\mathbf x,\\qquad A\\succ0\\iff\\lambda_i>0",explanation:"二次型在所有方向非负表示半正定；对称矩阵正定等价于全部特征值为正。",nature:"推导",
    variables:[V("x","任意非零向量","探测一个方向"),V("x^TAx","二次型","方向上的能量/曲率"),V("λ_i","A 的特征值","谱方向曲率")],
    derivation:[D("A=Q\\Lambda Q^T","实对称矩阵可正交对角化。"),D("x^TAx=(Q^Tx)^T\\Lambda(Q^Tx)","代入谱分解。"),D("=\\sum_i\\lambda_i z_i^2","令 z=Qᵀx。"),D("\\lambda_i\\ge0\\;\\forall i\\iff x^TAx\\ge0\\;\\forall x","逐项判断符号。")],
    example:E("A=diag(2,0)",["xᵀAx=2x₁²≥0","存在 x=[0,1] 使二次型为 0"],"A 半正定但不正定"),sources:[PPT(8)],tags:["PPT必含","正定"],visual:"optimization",
  },
  {
    id:"svd",title:"奇异值分解（SVD）",category:"线性代数",topic:"矩阵分解",
    latex:"A=U\\Sigma V^T",explanation:"任意矩阵都可分为右旋转、沿正交轴缩放、左旋转；奇异值衡量每个方向的增益。",nature:"推导",
    variables:[V("U","左奇异向量矩阵","输出空间正交基"),V("V","右奇异向量矩阵","输入空间正交基"),V("Σ","奇异值对角矩阵","非负缩放量"),V("A","任意 m×n 矩阵","可为非方阵")],
    derivation:[D("A^TA v_i=\\sigma_i^2v_i","对半正定矩阵 AᵀA 做特征分解。"),D("u_i=Av_i/\\sigma_i","把右奇异向量映到单位左奇异向量。"),D("Av_i=\\sigma_iu_i","每个基方向独立缩放。"),D("AV=U\\Sigma\\Rightarrow A=U\\Sigma V^T","V 正交，V⁻¹=Vᵀ。")],
    example:E("A=diag(3,1)",["AᵀA=diag(9,1)","σ=[3,1]，U=V=I"],"SVD 为 I·diag(3,1)·I"),sources:[PPT(8),ESL("14.5","14-Unsupervised-Learning/14.5-Principal-Components-Curves-and-Surfaces.md")],tags:["PPT必含","SVD"],visual:"matrix",
  },
  {
    id:"least-squares-projection",title:"最小二乘与正交投影",category:"线性代数",topic:"投影",
    latex:"\\hat\\beta=(X^TX)^{-1}X^Ty,\\qquad\\hat y=X\\hat\\beta=P_Xy",explanation:"残差与 X 的列空间正交，因此预测是 y 在特征子空间上的正交投影。",nature:"推导",
    variables:[V("X","n×p 设计矩阵","每行一个样本"),V("y","目标向量","观测输出"),V("β","回归系数","线性组合权重"),V("P_X","投影矩阵","X(XᵀX)⁻¹Xᵀ")],
    derivation:[D("L(\\beta)=\\|y-X\\beta\\|_2^2","定义平方残差。"),D("\\nabla_\\beta L=-2X^T(y-X\\beta)=0","对 β 求导并令零。"),D("X^TX\\hat\\beta=X^Ty","得到正规方程。"),D("\\hat\\beta=(X^TX)^{-1}X^Ty","X 满列秩时左乘逆。")],
    example:E("X=[1,2]ᵀ，y=[2,5]ᵀ",["XᵀX=5，Xᵀy=12","β̂=12/5=2.4","ŷ=[2.4,4.8]ᵀ"],"残差 [-0.4,0.2] 与 X 点积为 0"),sources:[ESL("3.2","03-Linear-Methods-for-Regression/3.2-Linear-Regression-Models-and-Least-Squares.md")],tags:["最小二乘","投影"],visual:"regression",
  },

  {
    id:"pmf",title:"离散概率质量函数（PMF）",category:"概率论与统计",topic:"概率基础",
    latex:"p_X(x)=P(X=x),\\qquad p_X(x)\\ge0,\\quad\\sum_{x\\in\\mathcal X}p_X(x)=1",explanation:"给每个离散取值分配非负概率，总质量为 1。",nature:"定义/构造",
    variables:[V("X","随机变量","把随机结果映射为数值"),V("x","一个可能取值","枚举状态"),V("\\mathcal X","样本取值集合","求和范围"),V("p_X","概率质量函数","返回点概率")],
    derivation:[D("p_X(x)=P(\\{\\omega:X(\\omega)=x\\})","把取值对应的样本事件收集起来。"),D("p_X(x)\\ge0","概率公理要求非负。"),D("\\sum_xp_X(x)=P(\\Omega)=1","互斥取值事件并集覆盖全集。")],
    example:E("公平骰子",["x∈{1,…,6}","每个 p(x)=1/6","总和 6·1/6=1"],"P(X>4)=2/6=1/3"),sources:[PPT(9)],tags:["PPT必含","PMF"],visual:"distribution",
  },
  {
    id:"pdf",title:"连续概率密度函数（PDF）",category:"概率论与统计",topic:"概率基础",
    latex:"p_X(x)\\ge0,\\quad\\int_{-\\infty}^{\\infty}p_X(x)dx=1,\\quad P(a\\le X\\le b)=\\int_a^bp_X(x)dx",explanation:"密度本身不是点概率；曲线下区间面积才是概率，连续变量单点概率为 0。",nature:"定义/构造",
    variables:[V("p_X(x)","概率密度","单位 x 上的概率强度"),V("a,b","区间端点","确定积分范围"),V("dx","无穷小宽度","密度×宽度形成小概率")],
    derivation:[D("F_X(x)=P(X\\le x)","先定义累计分布。"),D("p_X(x)=F'_X(x)","可导时把累计概率的变化率定义为密度。"),D("F_X(b)-F_X(a)=\\int_a^bp_X(x)dx","由微积分基本定理得到区间概率。")],
    example:E("X 在 [0,2] 均匀",["密度 p=1/2 使总面积 2·1/2=1","P(0.5≤X≤1.5)=1·1/2"],"区间概率为 0.5"),sources:[PPT(10)],tags:["PPT必含","PDF"],visual:"distribution",
  },
  {
    id:"joint-marginal",title:"联合分布与边缘化",category:"概率论与统计",topic:"联合概率",
    latex:"p_X(x)=\\sum_y p_{X,Y}(x,y)\\quad\\text{或}\\quad p_X(x)=\\int p_{X,Y}(x,y)dy",explanation:"忽略 Y 时，把所有可能的 Y 概率质量相加或密度积分掉。",nature:"推导",
    variables:[V("X,Y","两个随机变量","共同描述一个结果"),V("p_{X,Y}","联合分布","给同时取值的概率"),V("y","被消去变量","对其全空间求和/积分")],
    derivation:[D("\\{X=x\\}=\\bigcup_y\\{X=x,Y=y\\}","按 Y 的取值把事件互斥分割。"),D("P(X=x)=\\sum_yP(X=x,Y=y)","对互斥事件用可加性。"),D("p_X(x)=\\int p_{X,Y}(x,y)dy","连续情形把求和替换为积分。")],
    example:E("联合表 p(0,0)=.2,p(0,1)=.3,p(1,0)=.1,p(1,1)=.4",["p_X(0)=.2+.3=.5","p_X(1)=.1+.4=.5"],"X 的边缘分布为 [0.5,0.5]"),sources:[PPT(9),PPT(11)],tags:["PPT必含","边缘概率"],visual:"distribution",
  },
  {
    id:"conditional",title:"条件概率",category:"概率论与统计",topic:"联合概率",
    latex:"P(Y|X)=\\frac{P(X,Y)}{P(X)},\\qquad P(X,Y)=P(Y|X)P(X)",explanation:"已知 X 后，把联合概率在事件 X 内重新归一化。",nature:"定义/构造",
    variables:[V("P(Y|X)","条件概率","在 X 已发生的子空间中看 Y"),V("P(X,Y)","联合概率","X 与 Y 同时发生"),V("P(X)","归一化分母","要求 >0")],
    derivation:[D("P(Y|X)=P(Y\\cap X)/P(X)","把样本空间限制到 X。"),D("P(Y\\cap X)=P(Y|X)P(X)","两边乘 P(X) 得乘法法则。")],
    example:E("52 张牌中已知抽到人头牌",["人头牌 12 张，其中国王 4 张","P(K|人头)=4/12"],"1/3"),sources:[PPT(11)],tags:["PPT必含","条件概率"],visual:"distribution",
  },
  {
    id:"probability-chain",title:"概率链式法则",category:"概率论与统计",topic:"联合概率",
    latex:"P(x_1,\\ldots,x_n)=\\prod_{i=1}^nP(x_i|x_1,\\ldots,x_{i-1})",explanation:"把高维联合分布逐个拆为条件分布；自回归语言模型正是按此分解句子概率。",nature:"推导",
    variables:[V("x_i","第 i 个随机变量取值","按顺序展开"),V("P(x_i|x_{<i})","条件因子","已知前缀后预测当前")],
    derivation:[D("P(x_1,x_2)=P(x_2|x_1)P(x_1)","应用条件概率乘法法则。"),D("P(x_1,x_2,x_3)=P(x_3|x_1,x_2)P(x_1,x_2)","把前三项视作两块。"),D("=\\prod_iP(x_i|x_{<i})","递归展开到第 n 项。")],
    example:E("三词序列“我 爱 数学”",["P(句子)=P(我)P(爱|我)P(数学|我,爱)","若概率 .1,.4,.5，则乘积 .02"],"序列概率 0.02"),sources:[PPT(11)],tags:["PPT必含","语言模型"],visual:"generic",
  },
  {
    id:"independence",title:"独立与条件独立",category:"概率论与统计",topic:"联合概率",
    latex:"X\\perp Y\\iff P(X,Y)=P(X)P(Y),\\qquad X\\perp Y|Z\\iff P(X,Y|Z)=P(X|Z)P(Y|Z)",explanation:"独立表示知道一个变量不会改变另一个变量的分布；条件独立是在固定 Z 后成立。",nature:"定义/构造",
    variables:[V("X,Y","被比较变量","检查联合是否可分解"),V("Z","条件变量","固定后再判断"),V("\\perp","独立符号","表示概率因子化")],
    derivation:[D("P(Y|X)=P(Y)","“知道 X 不改变 Y”是直观定义。"),D("P(X,Y)=P(Y|X)P(X)","使用乘法法则。"),D("P(X,Y)=P(X)P(Y)","代入不变性得到因子化。")],
    example:E("抛两枚公平硬币",["P(正,正)=1/4","P(第一正)P(第二正)=1/2·1/2=1/4"],"两次结果独立"),sources:[PPT(11)],tags:["PPT必含","独立性"],visual:"distribution",
  },
  {
    id:"total-probability",title:"全概率公式",category:"概率论与统计",topic:"贝叶斯",
    latex:"P(X)=\\sum_iP(X|C=i)P(C=i)",explanation:"按互斥且完备的类别 C 分层计算 X 的总概率，是混合模型和贝叶斯公式的分母。",nature:"推导",
    variables:[V("C","分层/类别变量","其取值构成样本空间分割"),V("X","目标事件","在每层计算条件概率"),V("i","类别索引","遍历所有层")],
    derivation:[D("X=\\bigcup_i(X\\cap\\{C=i\\})","用类别把事件 X 分割。"),D("P(X)=\\sum_iP(X,C=i)","互斥事件概率相加。"),D("=\\sum_iP(X|C=i)P(C=i)","对每项使用乘法法则。")],
    example:E("两工厂供货：A 60% 次品率1%，B 40% 次品率3%",["P(次品)=.01·.6+.03·.4","=.006+.012=.018"],"总次品率 1.8%"),sources:[PPT(15)],tags:["PPT必含","全概率"],visual:"distribution",
  },
  {
    id:"bayes",title:"贝叶斯公式",category:"概率论与统计",topic:"贝叶斯",
    latex:"P(Y|X)=\\frac{P(X|Y)P(Y)}{P(X)}",explanation:"后验 = 似然 × 先验 ÷ 证据；观察 X 后更新对 Y 的相信程度。",nature:"推导",
    variables:[V("P(Y)","先验","观察数据前的信念"),V("P(X|Y)","似然","假设 Y 下看到 X 的概率"),V("P(X)","证据","对所有 Y 边缘化"),V("P(Y|X)","后验","观察后更新的信念")],
    derivation:[D("P(X,Y)=P(Y|X)P(X)","按 X 条件展开联合概率。"),D("P(X,Y)=P(X|Y)P(Y)","也可按 Y 条件展开。"),D("P(Y|X)=P(X|Y)P(Y)/P(X)","令两式相等并除以 P(X)。")],
    example:E("患病率1%，灵敏度99%，假阳性5%",["分子 .99·.01=.0099","证据 .0099+.05·.99=.0594","后验 .0099/.0594"],"阳性后患病概率约 16.7%"),sources:[PPT(13)],tags:["PPT必含","贝叶斯"],visual:"distribution",
  },
  {
    id:"expectation",title:"期望与线性性",category:"概率论与统计",topic:"矩",
    latex:"\\mathbb E[f(X)]=\\sum_xp(x)f(x)\\;\\text{或}\\;\\int p(x)f(x)dx,\\quad\\mathbb E[\\alpha f+\\beta g]=\\alpha\\mathbb E[f]+\\beta\\mathbb E[g]",explanation:"期望是按概率加权的长期平均；积分/求和的线性直接带来期望线性。",nature:"定义/构造",
    variables:[V("f(X)","随机变量的函数","对每个结果计算值"),V("p(x)","概率权重","离散求和或连续积分"),V("α,β","常数系数","可移出期望")],
    derivation:[D("\\mathbb E[\\alpha f+\\beta g]=\\sum_xp(x)[\\alpha f(x)+\\beta g(x)]","代入离散期望定义。"),D("=\\alpha\\sum_xp(x)f(x)+\\beta\\sum_xp(x)g(x)","利用求和分配律。"),D("=\\alpha\\mathbb E[f]+\\beta\\mathbb E[g]","识别两个期望。")],
    example:E("公平骰子 X",["E[X]=(1+2+3+4+5+6)/6","=21/6"],"E[X]=3.5"),sources:[PPT(12)],tags:["PPT必含","期望"],visual:"distribution",
  },
  {
    id:"variance",title:"方差",category:"概率论与统计",topic:"矩",
    latex:"\\operatorname{Var}(X)=\\mathbb E[(X-\\mu)^2]=\\mathbb E[X^2]-\\mathbb E[X]^2",explanation:"方差度量对均值的平方偏离；第二种形式便于计算但数值上可能有消减误差。",nature:"推导",
    variables:[V("X","随机变量","观测值"),V("\\mu=E[X]","均值","分布中心"),V("Var(X)","方差","平方单位的离散程度")],
    derivation:[D("E[(X-\\mu)^2]=E[X^2-2\\mu X+\\mu^2]","展开平方。"),D("=E[X^2]-2\\mu E[X]+\\mu^2","利用期望线性。"),D("=E[X^2]-\\mu^2","代入 E[X]=μ。")],
    example:E("X∈{1,3} 各 1/2",["μ=2","E[X²]=(1+9)/2=5","Var=5-4=1"],"标准差为 1"),sources:[PPT(12)],tags:["PPT必含","方差"],visual:"distribution",
  },
  {
    id:"covariance",title:"协方差与相关系数",category:"概率论与统计",topic:"矩",
    latex:"\\operatorname{Cov}(X,Y)=\\mathbb E[XY]-\\mathbb E[X]\\mathbb E[Y],\\qquad\\rho=\\frac{\\operatorname{Cov}(X,Y)}{\\sigma_X\\sigma_Y}",explanation:"协方差看两个变量是否同向偏离均值；相关系数再除以尺度，范围在 [-1,1]。",nature:"推导",
    variables:[V("X,Y","两个随机变量","成对观测"),V("σ_X,σ_Y","标准差","消除量纲"),V("ρ","相关系数","标准化协方差")],
    derivation:[D("E[(X-\\mu_X)(Y-\\mu_Y)]","从中心化乘积定义出发。"),D("=E[XY]-\\mu_XE[Y]-\\mu_YE[X]+\\mu_X\\mu_Y","展开并用线性性。"),D("=E[XY]-E[X]E[Y]","代入两个均值。"),D("|Cov|\\le\\sigma_X\\sigma_Y\\Rightarrow|\\rho|\\le1","柯西–施瓦茨不等式给出范围。")],
    example:E("Y=2X+1，Var(X)=3",["Cov(X,Y)=Cov(X,2X+1)=2Var(X)=6","σY=2σX，因此 ρ=1"],"完全正相关"),sources:[PPT(12)],tags:["PPT必含","协方差"],visual:"distribution",
  },
  {
    id:"gaussian",title:"一维高斯分布",category:"概率论与统计",topic:"常见分布",
    latex:"p(x)=\\frac1{\\sqrt{2\\pi\\sigma^2}}\\exp\\left[-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right]",explanation:"由位置 μ 和尺度 σ² 决定的钟形密度；最大熵性质使它成为噪声建模的核心。",nature:"定义/构造",
    variables:[V("x","连续观测","代入密度"),V("μ","均值/中心","平移曲线"),V("σ²","方差","控制宽窄"),V("exp","指数函数","把平方距离转为衰减")],
    derivation:[D("q(x)=\\exp[-(x-\\mu)^2/(2\\sigma^2)]","先构造关于 μ 对称、随平方距离衰减的核。"),D("Z=\\int_{-\\infty}^{\\infty}q(x)dx=\\sqrt{2\\pi\\sigma^2}","用高斯积分计算归一化常数。"),D("p(x)=q(x)/Z","除以总面积使积分为 1。")],
    example:E("标准正态 μ=0,σ=1，在 x=0",["指数项 e⁰=1","p(0)=1/√(2π)"],"p(0)≈0.399（密度，不是点概率）"),sources:[PPT(13)],tags:["PPT必含","高斯"],visual:"distribution",
  },
  {
    id:"multivariate-gaussian",title:"多元高斯分布",category:"概率论与统计",topic:"常见分布",
    latex:"p(\\mathbf x)=\\frac{\\exp[-\\tfrac12(\\mathbf x-\\boldsymbol\\mu)^T\\Sigma^{-1}(\\mathbf x-\\boldsymbol\\mu)]}{(2\\pi)^{d/2}|\\Sigma|^{1/2}}",explanation:"协方差矩阵 Σ 决定椭球的方向和轴长；指数中的马氏距离把相关性纳入距离。",nature:"推导",
    variables:[V("x","d 维观测","列向量"),V("μ","均值向量","椭球中心"),V("Σ","正定协方差矩阵","控制尺度与相关性"),V("|Σ|","行列式","总体积缩放"),V("Σ^{-1}","精度矩阵","计算马氏距离")],
    derivation:[D("z=\\Sigma^{-1/2}(x-\\mu)","白化：平移后按协方差逆平方根缩放。"),D("p_Z(z)=(2\\pi)^{-d/2}e^{-z^Tz/2}","白化变量为标准多元正态。"),D("dx=|\\Sigma|^{1/2}dz","变量替换的雅可比给体积因子。"),D("p_X(x)=p_Z(z)/|\\Sigma|^{1/2}","代入 z 得最终密度。")],
    example:E("μ=0，Σ=diag(4,1)",["Σ⁻¹=diag(1/4,1)","等密度线 x₁²/4+x₂²=c"],"横轴标准差 2，纵轴标准差 1"),sources:[PPT(13),PPT(14)],tags:["PPT必含","多元高斯"],visual:"distribution",
  },
  {
    id:"mixture",title:"混合分布与高斯混合",category:"概率论与统计",topic:"潜变量模型",
    latex:"p(x)=\\sum_{k=1}^K\\pi_kp(x|z=k),\\qquad\\pi_k\\ge0,\\;\\sum_k\\pi_k=1",explanation:"先按 π 选择潜在成分 z，再从该成分生成 x；高斯混合令每个条件分布都是高斯。",nature:"推导",
    variables:[V("z","离散潜变量","标记成分"),V("π_k=P(z=k)","混合权重","各成分先验概率"),V("p(x|z=k)","第 k 个成分密度","常取高斯"),V("K","成分数","求和上限")],
    derivation:[D("p(x)=\\sum_kp(x,z=k)","对潜变量 z 边缘化。"),D("p(x,z=k)=p(x|z=k)p(z=k)","用条件概率乘法法则。"),D("p(x)=\\sum_k\\pi_kp(x|z=k)","代入 πₖ 定义。")],
    example:E("两个高斯权重 .3 与 .7，在某 x 密度分别 .2 与 .5",["p(x)=.3·.2+.7·.5","=.06+.35"],"混合密度 0.41"),sources:[PPT(15),ESL("6.8","06-Kernel-Smoothing-Methods/6.8-Mixture-Models-for-Density-Estimation-and-Classification.md")],tags:["PPT必含","GMM"],visual:"distribution",
  },
  {
    id:"bernoulli",title:"伯努利与二项分布",category:"概率论与统计",topic:"常见分布",
    latex:"P(X=x)=p^x(1-p)^{1-x},\\quad P(S=k)=\\binom nkp^k(1-p)^{n-k}",explanation:"伯努利描述一次 0/1 试验；n 次独立成功次数的组合计数产生二项分布。",nature:"推导",
    variables:[V("p","单次成功概率","0≤p≤1"),V("X","一次结果","x∈{0,1}"),V("S","n 次成功总数","S=ΣXᵢ"),V("k","成功次数","0…n"),V("\\binom nk","排列组合数","选择 k 个成功位置")],
    derivation:[D("P(\\text{某固定序列})=p^k(1-p)^{n-k}","独立性使概率相乘。"),D("\\#\\{\\text{k 个成功的位置}\\}=\\binom nk","从 n 个位置选 k 个。"),D("P(S=k)=\\binom nkp^k(1-p)^{n-k}","互斥序列概率相加。")],
    example:E("抛 3 次公平硬币，恰 2 正",["C(3,2)=3","每个序列概率 (1/2)³=1/8"],"概率 3/8"),sources:[STD()],tags:["伯努利","二项"],visual:"distribution",
  },
  {
    id:"maximum-likelihood",title:"最大似然估计（MLE）",category:"概率论与统计",topic:"统计推断",
    latex:"\\hat\\theta_{MLE}=\\arg\\max_\\theta\\prod_{i=1}^np(x_i|\\theta)=\\arg\\max_\\theta\\sum_{i=1}^n\\log p(x_i|\\theta)",explanation:"选择最能解释已观测数据的参数；取对数把乘积变成和并改善数值稳定性。",nature:"定义/构造",
    variables:[V("x_i","第 i 个观测","假设条件独立同分布"),V("θ","模型参数","被优化"),V("p(x_i|θ)","似然因子","参数给定时数据密度"),V("n","样本数","求和/乘积范围")],
    derivation:[D("p(\\mathcal D|\\theta)=\\prod_ip(x_i|\\theta)","独立样本的联合似然相乘。"),D("\\log p(\\mathcal D|\\theta)=\\sum_i\\log p(x_i|\\theta)","对数单调，不改变极值位置。"),D("\\nabla_\\theta\\log p(\\mathcal D|\\theta)=0","可微内点用一阶条件求候选解。")],
    example:E("伯努利数据中 k 次成功、n-k 次失败",["ℓ=k log p+(n-k)log(1-p)","dℓ/dp=k/p-(n-k)/(1-p)=0"],"p̂=k/n"),sources:[ESL("8.2","08-Model-Inference-and-Averaging/8.2-The-Bootstrap-and-Maximum-Likelihood-Methods.md")],tags:["MLE","似然"],visual:"distribution",
  },
  {
    id:"map",title:"最大后验估计（MAP）",category:"概率论与统计",topic:"贝叶斯推断",
    latex:"\\hat\\theta_{MAP}=\\arg\\max_\\theta[\\log p(\\mathcal D|\\theta)+\\log p(\\theta)]",explanation:"在最大似然上加入参数先验；高斯先验对应 L₂ 正则，拉普拉斯先验对应 L₁ 正则。",nature:"推导",
    variables:[V("p(θ)","参数先验","编码观察数据前的偏好"),V("p(D|θ)","数据似然","参数解释数据的能力"),V("p(θ|D)","参数后验","二者结合后的分布")],
    derivation:[D("p(\\theta|D)=p(D|\\theta)p(\\theta)/p(D)","应用贝叶斯公式。"),D("\\arg\\max_\\theta p(\\theta|D)=\\arg\\max_\\theta p(D|\\theta)p(\\theta)","证据 p(D) 与 θ 无关。"),D("=\\arg\\max_\\theta[\\log p(D|\\theta)+\\log p(\\theta)]","取单调对数。")],
    example:E("正态均值估计，先验 μ~N(0,1)，一条观测 x=2，噪声方差1",["负对数后验 ∝(2-μ)²/2+μ²/2","求导 (μ-2)+μ=0"],"MAP μ=1"),sources:[ESL("8.3","08-Model-Inference-and-Averaging/8.3-Bayesian-Methods.md")],tags:["MAP","贝叶斯"],visual:"distribution",
  },
  {
    id:"entropy",title:"信息熵",category:"概率论与统计",topic:"信息论",
    latex:"H(X)=-\\sum_xp(x)\\log p(x)",explanation:"熵是平均惊讶度；分布越均匀越难预测，熵越大。",nature:"定义/构造",
    variables:[V("p(x)","结果 x 的概率","作为加权系数"),V("-log p(x)","自信息","小概率事件信息量大"),V("H(X)","平均信息量","对自信息取期望")],
    derivation:[D("I(x)=-\\log p(x)","要求独立事件信息可加：I(x,y)=I(x)+I(y)，对数满足。"),D("H(X)=E[I(X)]","用概率对每种惊讶度求平均。"),D("H(X)=-\\sum_xp(x)\\log p(x)","代入离散期望。")],
    example:E("公平硬币，log₂",["H=-2·(1/2)log₂(1/2)","=-log₂(1/2)"],"H=1 bit"),sources:[ESL("10.6","10-Boosting-and-Additive-Trees/10.6-Loss-Functions-and-Robustness.md")],tags:["熵","信息论"],visual:"distribution",
  },
  {
    id:"cross-entropy",title:"交叉熵",category:"概率论与统计",topic:"信息论",
    latex:"H(p,q)=-\\sum_xp(x)\\log q(x)=H(p)+D_{KL}(p\\|q)",explanation:"用模型 q 编码真实分布 p 的平均代价；最小化交叉熵等价于最小化 KL 散度。",nature:"推导",
    variables:[V("p","真实/目标分布","提供期望权重"),V("q","模型预测分布","提供编码概率"),V("H(p,q)","交叉熵","模型编码代价")],
    derivation:[D("D_{KL}(p\\|q)=\\sum_xp(x)\\log\\frac{p(x)}{q(x)}","写 KL 定义。"),D("=\\sum_xp(x)\\log p(x)-\\sum_xp(x)\\log q(x)","拆开对数比值。"),D("D_{KL}=-H(p)+H(p,q)","识别熵与交叉熵。"),D("H(p,q)=H(p)+D_{KL}","移项。")],
    example:E("二分类目标 y=1，模型 q=0.8",["CE=-log(0.8)"],"约 0.223 nat"),sources:[STD()],tags:["交叉熵","损失"],visual:"distribution",
  },
  {
    id:"kl",title:"KL 散度",category:"概率论与统计",topic:"信息论",
    latex:"D_{KL}(p\\|q)=\\sum_xp(x)\\log\\frac{p(x)}{q(x)}\\ge0",explanation:"衡量用 q 近似 p 时多付出的编码代价；不对称，因此不是距离。",nature:"推导",
    variables:[V("p","参考分布","期望在 p 下计算"),V("q","近似分布","必须在 p>0 处也 >0"),V("D_{KL}","相对熵","单位取决于对数底")],
    derivation:[D("-D_{KL}=E_p[\\log(q/p)]","移入期望。"),D("E_p[\\log(q/p)]\\le\\log E_p[q/p]","对凹函数 log 使用 Jensen 不等式。"),D("\\log\\sum_xq(x)=\\log1=0","计算期望。"),D("D_{KL}\\ge0","两边取负号。")],
    example:E("p=[.5,.5]，q=[.9,.1]",["KL=.5log(.5/.9)+.5log(.5/.1)"],"约 0.511 nat"),sources:[STD()],tags:["KL","信息论"],visual:"distribution",
  },
];

const classicMlFormulas: FormulaEntry[] = [
  {
    id:"expected-risk",title:"期望风险与贝叶斯预测",category:"经典机器学习（ESL）",topic:"统计决策理论",
    latex:"R(f)=\\mathbb E_{X,Y}[L(Y,f(X))],\\qquad f^*(x)=\\arg\\min_a\\mathbb E[L(Y,a)|X=x]",explanation:"学习的目标不是只压低训练误差，而是最小化未知数据上的期望损失；逐个 x 最优即贝叶斯决策。",nature:"推导",
    variables:[V("f","预测函数","输入 x 后给出动作/预测"),V("L","损失函数","比较真实 y 与预测"),V("R(f)","总体风险","对数据分布取期望"),V("a","候选动作","在条件分布下优化")],
    derivation:[D("R(f)=\\int\\mathbb E[L(Y,f(x))|X=x]p(x)dx","用全期望把总体风险按 x 分层。"),D("f^*(x)=\\arg\\min_aE[L(Y,a)|X=x]","积分权重 p(x) 非负，因此每个 x 可逐点最小化。"),D("f^*(x)=E[Y|X=x]\\quad(L=(Y-a)^2)","平方损失求导得到条件均值。")],
    example:E("给定 x，Y 取 1、3 的概率各 1/2，平方损失",["E[(Y-a)²]=[(1-a)²+(3-a)²]/2","求导 2a-4=0"],"贝叶斯预测 a=2"),sources:[ESL("2.4","02-Overview-of-Supervised-Learning/2.4-Statistical-Decision-Theory.md")],tags:["ESL","风险"],visual:"regression",
  },
  {
    id:"bias-variance",title:"偏差–方差分解",category:"经典机器学习（ESL）",topic:"模型评估",
    latex:"\\mathbb E[(Y-\\hat f(x))^2]=\\sigma^2+\\operatorname{Bias}[\\hat f(x)]^2+\\operatorname{Var}[\\hat f(x)]",explanation:"测试误差由不可约噪声、系统性偏差和训练集敏感度三部分构成。",nature:"推导",
    variables:[V("Y=f(x)+\\varepsilon","测试目标","ε 均值0、方差σ²"),V("\\hat f","由训练集学得的模型","随训练集随机变化"),V("Bias","平均预测与真函数之差","系统误差"),V("Var","模型跨训练集的波动","不稳定性")],
    derivation:[D("Y-\\hat f=\\varepsilon+[f-E\\hat f]+[E\\hat f-\\hat f]","加减真函数与平均模型。"),D("E[(Y-\\hat f)^2]","平方并取期望。"),D("E[\\varepsilon^2]+(f-E\\hat f)^2+E[(\\hat f-E\\hat f)^2]","交叉项因零均值而消失。")],
    example:E("噪声方差1、偏差2、模型方差3",["测试 MSE=1+2²+3"],"总误差 8"),sources:[ESL("2.9","02-Overview-of-Supervised-Learning/2.9-Model-Selection-and-the-Bias-Variance-Tradeoff.md"),ESL("7.3","07-Model-Assessment-and-Selection/7.3-The-Bias-Variance-Decomposition.md")],tags:["ESL","偏差方差"],visual:"regression",
  },
  {
    id:"ridge",title:"岭回归",category:"经典机器学习（ESL）",topic:"线性回归",
    latex:"\\hat\\beta^{ridge}=(X^TX+\\lambda I)^{-1}X^Ty",explanation:"在最小二乘中惩罚系数平方，稳定共线性方向并控制模型方差。",nature:"推导",
    variables:[V("X,y","设计矩阵与目标","构成线性回归数据"),V("β","系数向量","被估计"),V("λ","正则强度","λ≥0"),V("I","单位矩阵","对各系数均匀收缩")],
    derivation:[D("J(\\beta)=\\|y-X\\beta\\|^2+\\lambda\\|\\beta\\|^2","平方损失加 L₂ 惩罚。"),D("\\nabla J=-2X^Ty+2X^TX\\beta+2\\lambda\\beta=0","求梯度。"),D("(X^TX+\\lambda I)\\beta=X^Ty","整理正规方程。"),D("\\hat\\beta=(X^TX+\\lambda I)^{-1}X^Ty","左乘逆矩阵。")],
    example:E("XᵀX=4，Xᵀy=8，λ=1",["β̂=8/(4+1)"],"β̂=1.6；无正则时为2"),sources:[ESL("3.4","03-Linear-Methods-for-Regression/3.4-Shrinkage-Methods.md")],tags:["ESL","岭回归"],visual:"regression",
  },
  {
    id:"lasso",title:"Lasso 回归",category:"经典机器学习（ESL）",topic:"线性回归",
    latex:"\\hat\\beta=\\arg\\min_\\beta\\frac12\\|y-X\\beta\\|_2^2+\\lambda\\|\\beta\\|_1",explanation:"L₁ 惩罚的尖角会把部分系数精确压到 0，实现稀疏变量选择。",nature:"推导",
    variables:[V("||β||₁","系数绝对值之和","不可导点位于0"),V("λ","收缩强度","越大越稀疏"),V("X,y","输入与目标","用于残差项")],
    derivation:[D("0\\in-X^T(y-X\\hat\\beta)+\\lambda\\partial\\|\\hat\\beta\\|_1","写次梯度最优条件。"),D("\\partial|\\beta_j|=\\operatorname{sign}(\\beta_j)\\;(\\beta_j\\ne0),\\;[-1,1]\\;(=0)","绝对值在0处有区间次梯度。"),D("\\hat\\beta_j=S_\\lambda(z_j)=\\operatorname{sign}(z_j)(|z_j|-\\lambda)_+","正交设计下解为软阈值。")],
    example:E("单变量标准化后 z=0.8，λ=0.5",["Sλ(z)=sign(.8)(.8-.5)"],"系数 0.3；若 |z|≤.5 则为0"),sources:[ESL("3.4","03-Linear-Methods-for-Regression/3.4-Shrinkage-Methods.md"),ESL("18.4","18-High-Dimensional-Problems/18.4-Linear-Classifiers-with-L1-Regularization.md")],tags:["ESL","Lasso","稀疏"],visual:"regression",
  },
  {
    id:"elastic-net",title:"弹性网络",category:"经典机器学习（ESL）",topic:"线性回归",
    latex:"\\min_\\beta\\frac12\\|y-X\\beta\\|^2+\\lambda[\\alpha\\|\\beta\\|_1+\\tfrac{1-\\alpha}{2}\\|\\beta\\|_2^2]",explanation:"混合 L₁ 的稀疏性与 L₂ 的稳定性，相关特征更容易成组进入模型。",nature:"定义/构造",
    variables:[V("α","L₁ 混合比例","0≤α≤1"),V("λ","总正则强度","同时缩放两种惩罚"),V("β","模型系数","受稀疏和收缩约束")],
    derivation:[D("P(\\beta)=\\alpha\\|\\beta\\|_1+(1-\\alpha)\\|\\beta\\|_2^2/2","构造凸组合惩罚。"),D("\\alpha=1\\Rightarrow P=\\|\\beta\\|_1","退化为 Lasso。"),D("\\alpha=0\\Rightarrow P=\\|\\beta\\|_2^2/2","退化为岭回归。")],
    example:E("β=[2,-1]，α=.5，λ=1",["L₁部分=.5·3=1.5","L₂部分=.5·(5/2)=1.25"],"总惩罚 2.75"),sources:[ESL("3.4","03-Linear-Methods-for-Regression/3.4-Shrinkage-Methods.md")],tags:["ESL","正则化"],visual:"regression",
  },
  {
    id:"logistic-regression",title:"逻辑回归",category:"经典机器学习（ESL）",topic:"线性分类",
    latex:"p(y=1|x)=\\sigma(\\beta_0+x^T\\beta),\\qquad\\log\\frac{p}{1-p}=\\beta_0+x^T\\beta",explanation:"令对数几率是输入的线性函数，再用 sigmoid 映射到 [0,1]。",nature:"推导",
    variables:[V("p","正类概率","0<p<1"),V("β₀","截距","整体移动决策边界"),V("β","权重向量","与特征点积"),V("σ(z)","1/(1+e^{-z})","把实数映射为概率")],
    derivation:[D("\\log[p/(1-p)]=z","假设 log-odds 对特征线性，z=β₀+xᵀβ。"),D("p/(1-p)=e^z","两边取指数。"),D("p=e^z/(1+e^z)=1/(1+e^{-z})","解出 p。")],
    example:E("z=log 3",["odds=eᶻ=3","p=3/(1+3)"],"p=0.75"),sources:[ESL("4.4","04-Linear-Methods-for-Classification/4.4-Logistic-Regression.md")],tags:["ESL","逻辑回归"],visual:"activation",
  },
  {
    id:"lda",title:"线性判别分析（LDA）",category:"经典机器学习（ESL）",topic:"线性分类",
    latex:"\\delta_k(x)=x^T\\Sigma^{-1}\\mu_k-\\tfrac12\\mu_k^T\\Sigma^{-1}\\mu_k+\\log\\pi_k",explanation:"各类共享协方差时，高斯生成模型的对数后验差对 x 是线性的。",nature:"推导",
    variables:[V("μ_k","第 k 类均值","类别中心"),V("Σ","共享协方差","所有类别共同尺度"),V("π_k","类别先验","P(Y=k)"),V("δ_k","判别得分","选择最大类")],
    derivation:[D("\\log p(x|k)+\\log\\pi_k=-\\tfrac12(x-\\mu_k)^T\\Sigma^{-1}(x-\\mu_k)+\\log\\pi_k+C","写高斯对数后验，丢弃类无关常数。"),D("=-\\tfrac12x^T\\Sigma^{-1}x+x^T\\Sigma^{-1}\\mu_k-\\tfrac12\\mu_k^T\\Sigma^{-1}\\mu_k+\\log\\pi_k+C","展开二次型。"),D("\\delta_k=x^T\\Sigma^{-1}\\mu_k-\\tfrac12\\mu_k^T\\Sigma^{-1}\\mu_k+\\log\\pi_k","共享的 x 二次项在比较类别时相消。")],
    example:E("一维两类 μ₁=0,μ₂=2，σ²=1，先验相同",["δ₂-δ₁=2x-2","边界 2x-2=0"],"x=1 为线性边界"),sources:[ESL("4.3","04-Linear-Methods-for-Classification/4.3-Linear-Discriminant-Analysis.md")],tags:["ESL","LDA"],visual:"regression",
  },
  {
    id:"qda",title:"二次判别分析（QDA）",category:"经典机器学习（ESL）",topic:"线性分类",
    latex:"\\delta_k(x)=-\\tfrac12\\log|\\Sigma_k|-\\tfrac12(x-\\mu_k)^T\\Sigma_k^{-1}(x-\\mu_k)+\\log\\pi_k",explanation:"允许每类有不同协方差后，类别间相减不会消掉 x 的二次项，因此边界为二次曲线。",nature:"推导",
    variables:[V("Σ_k","第 k 类协方差","类别特有形状"),V("|Σ_k|","体积项","密度归一化"),V("μ_k,π_k","类均值与先验","定位并加权类别")],
    derivation:[D("p(k|x)\\propto p(x|k)\\pi_k","贝叶斯分类。"),D("\\log p(x|k)=-\\tfrac12\\log|\\Sigma_k|-\\tfrac12(x-\\mu_k)^T\\Sigma_k^{-1}(x-\\mu_k)+C","取多元高斯对数。"),D("\\hat k=\\arg\\max_k\\delta_k(x)","丢弃与 k 无关常数并比较得分。")],
    example:E("一维两类方差不同",["δ₁-δ₂ 含 x²(1/σ₂²-1/σ₁²)/2"],"决策方程为二次式，可有两个边界点"),sources:[ESL("4.3","04-Linear-Methods-for-Classification/4.3-Linear-Discriminant-Analysis.md")],tags:["ESL","QDA"],visual:"regression",
  },
  {
    id:"hinge-hyperplane",title:"分离超平面与间隔",category:"经典机器学习（ESL）",topic:"线性分类",
    latex:"f(x)=w^Tx+b,\\qquad\\operatorname{dist}(x,\\{f=0\\})=\\frac{|w^Tx+b|}{\\|w\\|_2}",explanation:"w 是超平面法向量；函数值除以法向量长度，得到几何距离。",nature:"推导",
    variables:[V("w","法向量","决定边界方向"),V("b","偏置","平移边界"),V("x","样本向量","代入线性得分"),V("f=0","决策超平面","正负号决定类别")],
    derivation:[D("x=x_0+tw/\\|w\\|","从边界点 x₀ 沿单位法向量走距离 t。"),D("w^Tx+b=w^Tx_0+b+t\\|w\\|=t\\|w\\|","边界点满足 wᵀx₀+b=0。"),D("|t|=|w^Tx+b|/\\|w\\|","解出垂直距离。")],
    example:E("边界 3x+4y-10=0，点(0,0)",["分子 |-10|=10","||w||=5"],"距离 2"),sources:[ESL("4.5","04-Linear-Methods-for-Classification/4.5-Separating-Hyperplanes.md")],tags:["ESL","超平面"],visual:"regression",
  },
  {
    id:"spline-basis",title:"截断幂样条基",category:"经典机器学习（ESL）",topic:"基展开与正则化",
    latex:"f(x)=\\sum_{j=0}^{M}\\beta_jx^j+\\sum_{k=1}^{K}\\theta_k(x-\\xi_k)_+^M",explanation:"全局多项式加上结点后的截断幂，可构造在结点处保持 M−1 阶连续的分段多项式。",nature:"定义/构造",
    variables:[V("M","多项式次数","决定光滑阶数"),V("ξ_k","第 k 个结点","局部形状开始改变的位置"),V("(u)_+","max(u,0)","只在结点右侧生效"),V("β,θ","基函数系数","线性拟合")],
    derivation:[D("1,x,\\ldots,x^M","先给出全局 M 次多项式基。"),D("(x-\\xi_k)_+^M","每个结点增加仅右侧非零的弯折基。"),D("f(x)=\\Phi(x)^T\\gamma","把所有基线性组合，结点左右自然共享低阶导数。")],
    example:E("M=1，结点 ξ=2",["f=β₀+β₁x+θ(x-2)₊","x≤2 斜率 β₁；x>2 斜率 β₁+θ"],"在 x=2 连续但斜率可改变"),sources:[ESL("5.2","05-Basis-Expansions-and-Regularization/5.2-Piecewise-Polynomials-and-Splines.md")],tags:["ESL","样条"],visual:"curve",
  },
  {
    id:"smoothing-spline",title:"平滑样条",category:"经典机器学习（ESL）",topic:"基展开与正则化",
    latex:"\\hat f=\\arg\\min_f\\sum_{i=1}^n(y_i-f(x_i))^2+\\lambda\\int[f''(t)]^2dt",explanation:"第一项追随数据，第二项惩罚曲率；解是以训练输入为结点的自然三次样条。",nature:"定义/构造",
    variables:[V("f","待估光滑函数","无限维优化对象"),V("λ","平滑参数","权衡拟合与弯曲"),V("f''","二阶导数","度量局部曲率"),V("(x_i,y_i)","训练点","残差来源")],
    derivation:[D("RSS(f)=\\sum_i(y_i-f(x_i))^2","数据拟合项。"),D("J(f)=\\int[f''(t)]^2dt","曲率能量；直线的惩罚为0。"),D("RSS+\\lambda J","用拉格朗日思想合并平滑约束。"),D("\\hat f(x)=\\sum_jN_j(x)\\hat\\theta_j","表示定理把解限制到有限维自然样条基。")],
    example:E("λ 的两个极端",["λ→0：几乎插值训练点","λ→∞：要求 f''≈0"],"极大正则时趋于最小二乘直线"),sources:[ESL("5.4","05-Basis-Expansions-and-Regularization/5.4-Smoothing-Splines.md")],tags:["ESL","平滑样条"],visual:"curve",
  },
  {
    id:"kernel-regression",title:"Nadaraya–Watson 核回归",category:"经典机器学习（ESL）",topic:"核平滑",
    latex:"\\hat f(x)=\\frac{\\sum_iK((x-x_i)/h)y_i}{\\sum_iK((x-x_i)/h)}",explanation:"按样本与查询点的距离赋权，再做局部加权平均；带宽 h 控制偏差–方差。",nature:"推导",
    variables:[V("K","核函数","把距离映射为非负权重"),V("h","带宽","控制邻域宽度"),V("x_i,y_i","训练样本","参与局部平均"),V("x","查询点","计算预测的位置")],
    derivation:[D("w_i(x)=K((x-x_i)/h)","先计算相似度权重。"),D("\\tilde w_i=w_i/\\sum_jw_j","归一化使权重和为1。"),D("\\hat f(x)=\\sum_i\\tilde w_iy_i","用局部常数模型最小化加权平方误差。")],
    example:E("两个点 y=[2,6]，权重 [3,1]",["归一化权重 [.75,.25]","预测 .75·2+.25·6"],"ŷ=3"),sources:[ESL("6.1","06-Kernel-Smoothing-Methods/6.1-One-Dimensional-Kernel-Smoothers.md")],tags:["ESL","核回归"],visual:"regression",
  },
  {
    id:"kde",title:"核密度估计（KDE）",category:"经典机器学习（ESL）",topic:"核平滑",
    latex:"\\hat p_h(x)=\\frac1{nh^d}\\sum_{i=1}^nK\\left(\\frac{x-x_i}{h}\\right)",explanation:"在每个样本处放一个小核并求平均，得到无需参数化分布假设的平滑密度。",nature:"推导",
    variables:[V("n","样本数","平均核的分母"),V("d","数据维数","体积缩放 hᵈ"),V("h","带宽","核的尺度"),V("K","积分为1的核","每个样本贡献一个密度包")],
    derivation:[D("K_h(u)=h^{-d}K(u/h)","缩放核并用 h⁻ᵈ 保持积分为1。"),D("\\hat p_h(x)=n^{-1}\\sum_iK_h(x-x_i)","经验分布与核卷积。"),D("\\int\\hat p_h(x)dx=1","每个核积分1，平均后仍归一化。")],
    example:E("一维 n=2，矩形核 h=1，两样本都覆盖 x",["每个核高度1/2","p̂=(1/2)[1/2+1/2]"],"密度 0.5"),sources:[ESL("6.6","06-Kernel-Smoothing-Methods/6.6-Kernel-Density-Estimation-and-Classification.md")],tags:["ESL","KDE"],visual:"distribution",
  },
  {
    id:"cross-validation",title:"K 折交叉验证",category:"经典机器学习（ESL）",topic:"模型评估",
    latex:"CV_K=\\frac1n\\sum_{k=1}^K\\sum_{i\\in I_k}L(y_i,\\hat f^{-k}(x_i))",explanation:"每个样本都由未见过它的模型预测，用折外损失估计泛化误差。",nature:"定义/构造",
    variables:[V("I_k","第 k 个验证折","折之间互斥并覆盖数据"),V("f^{-k}","去掉第 k 折训练的模型","避免数据泄漏"),V("L","单样本损失","对所有折求和"),V("n","总样本数","归一化平均")],
    derivation:[D("\\{1,\\ldots,n\\}=\\bigsqcup_kI_k","把样本划分成 K 折。"),D("\\hat f^{-k}=A(D\\setminus I_k)","对每折只用其余数据训练。"),D("CV_K=n^{-1}\\sum_k\\sum_{i\\in I_k}L_i","汇总每个样本唯一一次的折外损失。")],
    example:E("4 折损失 [1,2,1,0]，每折1个样本",["CV=(1+2+1+0)/4"],"CV=1"),sources:[ESL("7.10","07-Model-Assessment-and-Selection/7.10-Cross-Validation.md")],tags:["ESL","交叉验证"],visual:"generic",
  },
  {
    id:"aic-bic",title:"AIC 与 BIC",category:"经典机器学习（ESL）",topic:"模型选择",
    latex:"AIC=-2\\ell(\\hat\\theta)+2k,\\qquad BIC=-2\\ell(\\hat\\theta)+k\\log n",explanation:"二者都用拟合优度减复杂度惩罚；BIC 的惩罚随样本量增长，通常更偏向简单模型。",nature:"定义/构造",
    variables:[V("ℓ","最大化后的对数似然","越大拟合越好"),V("k","自由参数数","复杂度"),V("n","样本数","只进入 BIC 惩罚")],
    derivation:[D("-2\\ell(\\hat\\theta)","把高似然转成需最小化的偏差尺度。"),D("+2k","AIC 用渐近乐观偏差修正每个参数约2。"),D("+k\\log n","BIC 从拉普拉斯近似边际似然得到更强惩罚。")],
    example:E("模型 A: ℓ=-100,k=5,n=100；模型 B: ℓ=-96,k=10",["AIC_A=210，AIC_B=212","BIC_A≈223.0，BIC_B≈238.1"],"两准则都选 A"),sources:[ESL("7.7","07-Model-Assessment-and-Selection/7.7-The-Bayesian-Approach-and-BIC.md")],tags:["ESL","AIC","BIC"],visual:"generic",
  },
  {
    id:"bootstrap",title:"Bootstrap 自助法",category:"经典机器学习（ESL）",topic:"重采样",
    latex:"\\widehat{SE}_{boot}=\\sqrt{\\frac1{B-1}\\sum_{b=1}^B(\\hat\\theta^{*b}-\\bar\\theta^*)^2}",explanation:"从经验分布有放回重采样，观察统计量在伪数据集间的波动来估计不确定性。",nature:"定义/构造",
    variables:[V("B","重采样次数","越大蒙特卡洛误差越小"),V("θ̂*b","第 b 个重采样统计量","在伪数据集上计算"),V("θ̄*","Bootstrap 平均","B 个估计的均值")],
    derivation:[D("\\hat F_n=n^{-1}\\sum_i\\delta_{x_i}","用经验分布近似未知总体。"),D("D^{*b}\\sim\\hat F_n^n","从经验分布独立有放回抽 n 次。"),D("\\hat\\theta^{*b}=T(D^{*b})","在每个样本上重算统计量。"),D("SE\\approx sd(\\hat\\theta^{*1},\\ldots,\\hat\\theta^{*B})","用样本标准差估计抽样波动。")],
    example:E("三个 bootstrap 估计 [2,4,3]",["均值3","平方偏差1,1,0；除 B-1=2 后为1"],"SE=1"),sources:[ESL("7.11","07-Model-Assessment-and-Selection/7.11-Bootstrap-Methods.md"),ESL("8.2","08-Model-Inference-and-Averaging/8.2-The-Bootstrap-and-Maximum-Likelihood-Methods.md")],tags:["ESL","Bootstrap"],visual:"distribution",
  },
  {
    id:"em",title:"EM 算法",category:"经典机器学习（ESL）",topic:"潜变量推断",
    latex:"Q(\\theta|\\theta^t)=E_{Z|X,\\theta^t}[\\log p(X,Z|\\theta)],\\qquad\\theta^{t+1}=\\arg\\max_\\theta Q",explanation:"E 步计算潜变量后验，M 步最大化完整数据对数似然；每轮不降低观测似然。",nature:"推导",
    variables:[V("X","观测数据","已知"),V("Z","潜变量","不可直接观察"),V("θᵗ","当前参数","用于 E 步后验"),V("Q","完整数据对数似然期望","M 步目标")],
    derivation:[D("\\log p(X|\\theta)=\\log\\sum_Zq(Z)\\frac{p(X,Z|\\theta)}{q(Z)}","乘除任意 q 并写成期望。"),D("\\ge E_q[\\log p(X,Z|\\theta)]-E_q[\\log q(Z)]","由 Jensen 得证据下界。"),D("q(Z)=p(Z|X,\\theta^t)","E 步令下界在当前参数处取等号。"),D("\\theta^{t+1}=\\arg\\max Q","M 步提高下界，因此似然不下降。")],
    example:E("两高斯混合",["E步：rᵢk=πₖN(xᵢ|μₖ,Σₖ)/ΣⱼπⱼN(xᵢ|μⱼ,Σⱼ)","M步：μₖ=Σᵢrᵢkxᵢ/Σᵢrᵢk"],"软分配与参数更新交替"),sources:[ESL("8.5","08-Model-Inference-and-Averaging/8.5-The-EM-Algorithm.md")],tags:["ESL","EM","GMM"],visual:"distribution",
  },
  {
    id:"metropolis-hastings",title:"Metropolis–Hastings",category:"经典机器学习（ESL）",topic:"MCMC",
    latex:"\\alpha(x,x')=\\min\\left(1,\\frac{\\pi(x')q(x|x')}{\\pi(x)q(x'|x)}\\right)",explanation:"用提议分布探索状态，并按接受率修正偏差，使目标分布 π 成为平稳分布。",nature:"推导",
    variables:[V("π","目标分布（可未归一化）","希望采样"),V("q(x'|x)","提议分布","从当前 x 生成候选"),V("α","接受概率","在0到1之间"),V("x,x'","当前与候选状态","接受或停留")],
    derivation:[D("\\pi(x)q(x'|x)\\alpha(x,x')=\\pi(x')q(x|x')\\alpha(x',x)","要求细致平衡。"),D("r=\\pi(x')q(x|x')/[\\pi(x)q(x'|x)]","构造正反流量比。"),D("\\alpha(x,x')=\\min(1,r)","该选择与反向 min(1,1/r) 恰好满足平衡。")],
    example:E("对称提议 q，目标密度从 .2 到 .5",["r=.5/.2=2.5","α=min(1,2.5)"],"必接受"),sources:[ESL("8.6","08-Model-Inference-and-Averaging/8.6-MCMC-for-Sampling-from-the-Posterior.md")],tags:["ESL","MCMC"],visual:"distribution",
  },
  {
    id:"bagging",title:"Bagging",category:"经典机器学习（ESL）",topic:"集成学习",
    latex:"\\hat f_{bag}(x)=\\frac1B\\sum_{b=1}^B\\hat f^{*b}(x)",explanation:"在 bootstrap 样本上训练多个不稳定模型再平均，主要降低方差。",nature:"定义/构造",
    variables:[V("B","基模型数","平均项数"),V("f*b","第 b 个 bootstrap 模型","在重采样数据上训练"),V("f_bag","集成预测","回归取均值，分类可投票")],
    derivation:[D("Var(B^{-1}\\sum_bZ_b)=B^{-2}\\sum_{b,c}Cov(Z_b,Z_c)","展开平均预测方差。"),D("=\\rho\\sigma^2+(1-\\rho)\\sigma^2/B","若基模型同方差 σ²、两两相关 ρ。"),D("\\to\\rho\\sigma^2","增大 B 消除独立噪声，只剩相关部分。")],
    example:E("独立基模型方差4，B=16",["ρ=0 时集成方差=4/16"],"方差降到0.25"),sources:[ESL("8.7","08-Model-Inference-and-Averaging/8.7-Bagging.md")],tags:["ESL","Bagging"],visual:"generic",
  },
  {
    id:"gam",title:"广义加性模型（GAM）",category:"经典机器学习（ESL）",topic:"加性模型",
    latex:"g(E[Y|X])=\\beta_0+\\sum_{j=1}^pf_j(X_j)",explanation:"每个特征拥有自己的非线性函数，再相加保持可解释性；g 连接响应均值与线性预测器。",nature:"定义/构造",
    variables:[V("g","连接函数","如 logit 或 log"),V("f_j","第 j 个平滑函数","只依赖一个特征"),V("β₀","截距","全局基线"),V("p","特征数","加和范围")],
    derivation:[D("\\eta=\\beta_0+\\sum_jf_j(X_j)","用可解释的一维效应近似多元函数。"),D("E[Y|X]=g^{-1}(\\eta)","通过逆连接映射到响应空间。"),D("f_j\\leftarrow S_j(y-\\beta_0-\\sum_{k\\ne j}f_k)","回拟算法对每个部分残差做平滑。")],
    example:E("logit(p)=−1+f₁(age)+f₂(income)",["若 f₁=.4,f₂=.6，则 logit(p)=0","p=σ(0)"],"p=0.5"),sources:[ESL("9.1","09-Additive-Models-Trees-and-Related-Methods/9.1-Generalized-Additive-Models.md")],tags:["ESL","GAM"],visual:"curve",
  },
  {
    id:"cart-split",title:"CART 回归树分裂",category:"经典机器学习（ESL）",topic:"树模型",
    latex:"(j^*,s^*)=\\arg\\min_{j,s}\\left[\\sum_{x_i\\in R_1(j,s)}(y_i-\\bar y_1)^2+\\sum_{x_i\\in R_2(j,s)}(y_i-\\bar y_2)^2\\right]",explanation:"枚举特征 j 和阈值 s，选择使左右节点内平方误差最小的切分。",nature:"定义/构造",
    variables:[V("j","候选特征索引","决定沿哪一轴切"),V("s","候选阈值","把样本分左右"),V("R₁,R₂","两个子区域","x_j≤s 与 >s"),V("ȳ_m","节点均值","该叶的最优常数预测")],
    derivation:[D("\\min_c\\sum_{i\\in R}(y_i-c)^2","叶节点采用常数预测。"),D("-2\\sum_{i\\in R}(y_i-c)=0\\Rightarrow c=\\bar y_R","求导得到节点均值。"),D("\\min_{j,s}[RSS(R_1)+RSS(R_2)]","代入左右叶最优常数并搜索分裂。")],
    example:E("y=[1,2|8,9] 的候选切分",["左均值1.5，RSS=.5","右均值8.5，RSS=.5"],"总 RSS=1"),sources:[ESL("9.2","09-Additive-Models-Trees-and-Related-Methods/9.2-Tree-Based-Methods.md")],tags:["ESL","CART"],visual:"generic",
  },
  {
    id:"gini",title:"基尼不纯度与信息增益",category:"经典机器学习（ESL）",topic:"树模型",
    latex:"G(R)=\\sum_kp_k(1-p_k)=1-\\sum_kp_k^2",explanation:"随机抽两次标签不同的概率；节点越纯，G 越接近0。",nature:"推导",
    variables:[V("p_k","节点中第 k 类比例","计数除以节点样本数"),V("K","类别数","求和范围"),V("G","基尼不纯度","用于分类树分裂")],
    derivation:[D("P(\\text{两次标签不同})=\\sum_kP(Y_1=k)P(Y_2\\ne k)","按第一次标签分层。"),D("=\\sum_kp_k(1-p_k)","独立抽样。"),D("=1-\\sum_kp_k^2","展开并用 Σpₖ=1。")],
    example:E("节点类别比例 [.75,.25]",["G=1-(.75²+.25²)"],"G=0.375"),sources:[ESL("9.2","09-Additive-Models-Trees-and-Related-Methods/9.2-Tree-Based-Methods.md")],tags:["ESL","决策树"],visual:"generic",
  },
  {
    id:"mars",title:"MARS 基函数",category:"经典机器学习（ESL）",topic:"加性模型",
    latex:"f(x)=\\beta_0+\\sum_{m=1}^M\\beta_mh_m(x),\\qquad h(x)=(x_j-t)_+\\;\\text{或}\\;(t-x_j)_+",explanation:"用成对折线铰链基逐步构建分段线性模型，并可通过基函数乘积表达交互。",nature:"定义/构造",
    variables:[V("t","结点/阈值","铰链转折位置"),V("j","选择的特征","铰链作用坐标"),V("h_m","第 m 个基函数","可为已有基与新铰链乘积"),V("β_m","线性系数","最小二乘估计")],
    derivation:[D("(u)_+=\\max(u,0)","构造单侧线性铰链。"),D("(x_j-t)_+,(t-x_j)_+","在每个候选结点加入镜像基对。"),D("f=\\beta_0+\\sum_m\\beta_mh_m","前向选择降低残差，后向剪枝控制复杂度。")],
    example:E("h₁=(x-2)₊，f=1+3h₁",["x=1 时 h=0，f=1","x=4 时 h=2，f=7"],"结点2后斜率增加3"),sources:[ESL("9.4","09-Additive-Models-Trees-and-Related-Methods/9.4-MARS.md")],tags:["ESL","MARS"],visual:"curve",
  },
  {
    id:"adaboost",title:"AdaBoost",category:"经典机器学习（ESL）",topic:"Boosting",
    latex:"\\alpha_m=\\tfrac12\\log\\frac{1-err_m}{err_m},\\quad w_i\\leftarrow w_i\\exp[-\\alpha_my_iG_m(x_i)],\\quad F=\\sum_m\\alpha_mG_m",explanation:"更准确的弱分类器获得更大权重；错分样本权重上升，迫使下一轮关注难例。",nature:"推导",
    variables:[V("G_m","第 m 个弱分类器","输出±1"),V("err_m","按 w 加权的错分率","小于1/2才有正权"),V("α_m","分类器系数","由线搜索得到"),V("w_i","样本权重","每轮归一化"),V("y_i","真实标签","±1")],
    derivation:[D("L(\\alpha)=\\sum_iw_i e^{-y_i\\alpha G_m(x_i)}","在指数损失下加一个弱学习器。"),D("=e^{-\\alpha}(1-err_m)+e^{\\alpha}err_m","按正确/错误样本分组。"),D("dL/d\\alpha=0\\Rightarrow e^{2\\alpha}=(1-err)/err","求一维最优。"),D("\\alpha=\\tfrac12\\log[(1-err)/err]","解出系数并更新权重。")],
    example:E("弱分类器错误率 .2",["α=.5log(.8/.2)=.5log4"],"α≈0.693，错分样本乘 e^α"),sources:[ESL("10.1","10-Boosting-and-Additive-Trees/10.1-Boosting-Methods.md"),ESL("10.4","10-Boosting-and-Additive-Trees/10.4-Exponential-Loss-and-AdaBoost.md")],tags:["ESL","AdaBoost"],visual:"generic",
  },
  {
    id:"gradient-boosting",title:"梯度提升",category:"经典机器学习（ESL）",topic:"Boosting",
    latex:"r_{im}=-\\left.\\frac{\\partial L(y_i,F(x_i))}{\\partial F(x_i)}\\right|_{F=F_{m-1}},\\qquad F_m=F_{m-1}+\\nu\\rho_mh_m",explanation:"把函数值当作参数，拟合损失的负梯度（伪残差），再沿该方向做线搜索。",nature:"推导",
    variables:[V("F_m","第 m 轮加性模型","累积弱学习器"),V("r_im","伪残差","损失对预测的负梯度"),V("h_m","拟合伪残差的基学习器","常为小树"),V("ρ_m","线搜索步长","最小化当前损失"),V("ν","收缩率","0<ν≤1")],
    derivation:[D("F_m=F_{m-1}+\\rho h","在函数空间选择增量。"),D("-\\nabla_FL=(r_{1m},\\ldots,r_{nm})","最陡下降方向是负梯度。"),D("h_m\\approx r_m","用可学习函数类投影负梯度。"),D("\\rho_m=\\arg\\min_\\rho\\sum_iL(y_i,F_{m-1}(x_i)+\\rho h_m(x_i))","沿方向线搜索。")],
    example:E("平方损失 L=(y-F)²/2",["−∂L/∂F=y−F","伪残差就是普通残差"],"每轮树拟合当前残差"),sources:[ESL("10.10","10-Boosting-and-Additive-Trees/10.10-Numerical-Optimization-via-Gradient-Boosting.md")],tags:["ESL","GBDT"],visual:"regression",
  },
  {
    id:"svm-primal",title:"软间隔支持向量机",category:"经典机器学习（ESL）",topic:"支持向量机",
    latex:"\\min_{w,b}\\frac12\\|w\\|^2+C\\sum_i[1-y_i(w^Tx_i+b)]_+",explanation:"最小化法向量长度以最大化间隔，同时用 hinge loss 惩罚间隔内和错分样本。",nature:"推导",
    variables:[V("w,b","超平面参数","定义 f(x)=wᵀx+b"),V("y_i","±1 标签","使正确分类时 y_if_i>0"),V("C","误差惩罚","权衡间隔与违例"),V("[u]_+","max(u,0)","hinge 损失")],
    derivation:[D("y_i(w^Tx_i+b)\\ge1","规范化函数间隔约束。"),D("\\text{几何间隔}=1/\\|w\\|","函数间隔除以法向量长度。"),D("\\max1/\\|w\\|\\Leftrightarrow\\min\\tfrac12\\|w\\|^2","转为凸目标。"),D("+C\\sum_i[1-y_if_i]_+","把软约束违例加入目标。")],
    example:E("某样本 y f(x)=0.4，C=2",["hinge=max(0,1-.4)=.6","损失贡献 2·.6"],"贡献 1.2"),sources:[ESL("12.2","12-Support-Vector-Machines-and-Flexible-Discriminants/12.2-The-Support-Vector-Classifier.md")],tags:["ESL","SVM"],visual:"regression",
  },
  {
    id:"kernel-trick",title:"核技巧",category:"经典机器学习（ESL）",topic:"支持向量机",
    latex:"K(x,z)=\\langle\\phi(x),\\phi(z)\\rangle,\\qquad f(x)=\\sum_i\\alpha_iy_iK(x_i,x)+b",explanation:"只计算高维特征的内积，无需显式构造 φ；对偶 SVM 的预测只依赖支持向量。",nature:"推导",
    variables:[V("φ","隐式特征映射","可能维度极高"),V("K","正定核函数","直接返回特征内积"),V("α_i","对偶系数","非零样本为支持向量"),V("x_i","训练样本","与查询 x 比较相似度")],
    derivation:[D("w=\\sum_i\\alpha_iy_i\\phi(x_i)","对偶最优条件把 w 表成训练特征线性组合。"),D("f(x)=\\langle w,\\phi(x)\\rangle+b","写特征空间超平面。"),D("=\\sum_i\\alpha_iy_i\\langle\\phi(x_i),\\phi(x)\\rangle+b","代入 w。"),D("=\\sum_i\\alpha_iy_iK(x_i,x)+b","用核替换内积。")],
    example:E("二次核 K(x,z)=(1+xz)²，x=2,z=3",["K=(1+6)²"],"隐式二次特征内积为49"),sources:[ESL("12.3","12-Support-Vector-Machines-and-Flexible-Discriminants/12.3-Support-Vector-Machines-and-Kernels.md")],tags:["ESL","核方法"],visual:"regression",
  },
  {
    id:"knn",title:"k 近邻分类",category:"经典机器学习（ESL）",topic:"原型方法",
    latex:"\\hat P(Y=g|x)=\\frac1k\\sum_{i\\in N_k(x)}\\mathbf1(y_i=g),\\qquad\\hat y=\\arg\\max_g\\hat P(Y=g|x)",explanation:"在查询点附近用训练标签的局部频率估计后验概率。",nature:"定义/构造",
    variables:[V("N_k(x)","离 x 最近的 k 个样本索引","按距离排序选取"),V("1(·)","指示函数","条件真为1否则0"),V("g","候选类别","逐类计数"),V("k","邻居数","控制局部平滑")],
    derivation:[D("P(Y=g|X=x)\\approx P(Y=g|X\\in\\mathcal N(x))","用小邻域近似点条件概率。"),D("\\hat P=\\#\\{i\\in N_k:y_i=g\\}/k","用邻域经验频率估计。"),D("\\hat y=\\arg\\max_g\\hat P","0–1 损失下选择最大后验类。")],
    example:E("5 个邻居标签 [A,A,B,A,B]",["P̂(A)=3/5，P̂(B)=2/5"],"预测 A"),sources:[ESL("13.3","13-Prototype-Methods-and-Nearest-Neighbors/13.3-k-Nearest-Neighbor-Classifiers.md")],tags:["ESL","kNN"],visual:"regression",
  },
  {
    id:"kmeans",title:"K-means",category:"经典机器学习（ESL）",topic:"无监督学习",
    latex:"\\min_{C_1,\\ldots,C_K}\\sum_{k=1}^K\\sum_{x_i\\in C_k}\\|x_i-\\mu_k\\|^2,\\qquad\\mu_k=\\frac1{|C_k|}\\sum_{x_i\\in C_k}x_i",explanation:"交替把点分到最近中心，再把中心更新为簇均值；每步都不增加目标。",nature:"推导",
    variables:[V("C_k","第 k 个簇","样本索引集合"),V("μ_k","簇中心","该簇向量均值"),V("K","簇数","预先给定"),V("x_i","样本向量","按欧氏距离分配")],
    derivation:[D("J=\\sum_{k,i\\in C_k}\\|x_i-\\mu_k\\|^2","定义簇内平方和。"),D("\\partial J/\\partial\\mu_k=-2\\sum_{i\\in C_k}(x_i-\\mu_k)=0","固定分配对中心求导。"),D("\\mu_k=|C_k|^{-1}\\sum_{i\\in C_k}x_i","中心更新为均值。"),D("C(x_i)=\\arg\\min_k\\|x_i-\\mu_k\\|^2","固定中心时独立选择最近簇。")],
    example:E("一维簇点 [1,2,6,7]，初始中心1,7",["分配 [1,2] 与 [6,7]","新中心 1.5 与 6.5"],"一次更新即稳定"),sources:[ESL("14.3","14-Unsupervised-Learning/14.3-Cluster-Analysis.md")],tags:["ESL","聚类"],visual:"regression",
  },
  {
    id:"pca",title:"主成分分析（PCA）",category:"经典机器学习（ESL）",topic:"降维",
    latex:"v_1=\\arg\\max_{\\|v\\|=1}v^TSv,\\qquad Sv_1=\\lambda_1v_1",explanation:"寻找投影后方差最大的单位方向；解是协方差矩阵最大特征值对应的特征向量。",nature:"推导",
    variables:[V("S","中心化数据协方差矩阵","S=XᵀX/n"),V("v","投影方向","约束单位长度"),V("vᵀSv","投影方差","要最大化"),V("λ₁","最大特征值","最大可解释方差")],
    derivation:[D("Var(Xv)=v^TSv","线性投影的方差。"),D("\\mathcal L=v^TSv-\\lambda(v^Tv-1)","加入单位范数约束。"),D("2Sv-2\\lambda v=0","对 v 求导。"),D("Sv=\\lambda v","候选方向是特征向量，取最大 λ。")],
    example:E("S=diag(4,1)",["特征值4、1，对应坐标轴","最大特征向量 [1,0]"],"第一主成分沿 x 轴，解释方差4"),sources:[ESL("14.5","14-Unsupervised-Learning/14.5-Principal-Components-Curves-and-Surfaces.md")],tags:["ESL","PCA"],visual:"matrix",
  },
  {
    id:"nmf",title:"非负矩阵分解（NMF）",category:"经典机器学习（ESL）",topic:"矩阵分解",
    latex:"\\min_{W,H\\ge0}\\|X-WH\\|_F^2",explanation:"把非负数据分解成非负基 W 与非负系数 H，常产生可加的“部件”表示。",nature:"定义/构造",
    variables:[V("X","m×n 非负数据矩阵","待近似"),V("W","m×r 非负基矩阵","学习部件"),V("H","r×n 非负编码","组合权重"),V("||·||_F","Frobenius 范数","所有元素平方和开根")],
    derivation:[D("X\\approx WH","设定低秩乘积分解。"),D("J=\\tfrac12\\sum_{ij}(X_{ij}-(WH)_{ij})^2","使用平方重构误差。"),D("W,H\\ge0","加入非负约束防止正负抵消。"),D("H\\leftarrow H\\odot(W^TX)/(W^TWH)","乘法更新保持非负并降低目标（逐元素运算）。")],
    example:E("X=[[2,4]]，r=1",["取 W=[[2]]，H=[[1,2]]","WH=[[2,4]]"],"零重构误差"),sources:[ESL("14.6","14-Unsupervised-Learning/14.6-Non-negative-Matrix-Factorization.md")],tags:["ESL","NMF"],visual:"matrix",
  },
  {
    id:"ica",title:"独立成分分析（ICA）",category:"经典机器学习（ESL）",topic:"降维",
    latex:"x=As,\\qquad\\hat s=Wx,\\qquad W\\approx A^{-1}",explanation:"观测 x 是独立非高斯源 s 的线性混合；通过最大化非高斯性/最小互信息恢复源。",nature:"定义/构造",
    variables:[V("s","潜在独立源","分量统计独立"),V("A","未知混合矩阵","把源混成观测"),V("x","观测向量","可测数据"),V("W","解混矩阵","学习 A 的逆")],
    derivation:[D("p_s(s)=\\prod_jp_j(s_j)","假设源独立。"),D("s=Wx,\\quad p_x(x)=|\\det W|\\prod_jp_j(w_j^Tx)","变量替换给出观测似然。"),D("\\ell(W)=n\\log|\\det W|+\\sum_{i,j}\\log p_j(w_j^Tx_i)","对样本取对数似然并优化 W。")],
    example:E("A=[[1,1],[1,-1]]，x=A[2,1]ᵀ",["x=[3,1]","A⁻¹=.5[[1,1],[1,-1]]","s=A⁻¹x=[2,1]"],"恢复原独立源"),sources:[ESL("14.7","14-Unsupervised-Learning/14.7-Independent-Component-Analysis-and-Exploratory-Projection-Pursuit.md")],tags:["ESL","ICA"],visual:"matrix",
  },
  {
    id:"mds",title:"多维尺度分析（MDS）",category:"经典机器学习（ESL）",topic:"降维",
    latex:"\\min_{z_1,\\ldots,z_n}\\sum_{i<j}(d_{ij}-\\|z_i-z_j\\|)^2",explanation:"只给两两距离时，在低维空间寻找坐标，使嵌入距离尽量保留原距离。",nature:"定义/构造",
    variables:[V("d_ij","原空间对象 i,j 的不相似度","输入距离"),V("z_i","低维嵌入坐标","待优化"),V("||z_i-z_j||","嵌入距离","与 d_ij 比较")],
    derivation:[D("e_{ij}=d_{ij}-\\|z_i-z_j\\|","定义每对距离残差。"),D("Stress(Z)=\\sum_{i<j}e_{ij}^2","用平方聚合所有不匹配。"),D("Z^*=\\arg\\min_ZStress(Z)","平移/旋转不改变目标，优化相对布局。")],
    example:E("三点距离 d₁₂=1,d₂₃=1,d₁₃=2",["取一维 z=[0,1,2]","三对距离完全匹配"],"Stress=0"),sources:[ESL("14.8","14-Unsupervised-Learning/14.8-Multidimensional-Scaling.md")],tags:["ESL","MDS"],visual:"regression",
  },
  {
    id:"pagerank",title:"PageRank",category:"经典机器学习（ESL）",topic:"图学习",
    latex:"\\mathbf r=\\alpha P^T\\mathbf r+(1-\\alpha)\\mathbf v",explanation:"随机浏览者以概率 α 沿链接走，以 1−α 随机跳转；r 是该马尔可夫链的平稳访问概率。",nature:"推导",
    variables:[V("P","行随机转移矩阵","每行和为1"),V("r","节点重要性概率向量","分量和1"),V("α","阻尼系数","通常接近0.85"),V("v","跳转分布","处理死端并保证遍历")],
    derivation:[D("T=\\alpha P+(1-\\alpha)\\mathbf1v^T","构造带随机跳转的转移矩阵。"),D("r=T^Tr","平稳分布满足一步后不变。"),D("r=\\alpha P^Tr+(1-\\alpha)v","展开 Tᵀr 并用 1ᵀr=1。")],
    example:E("两个节点互相链接，v=[.5,.5]",["对称性给 r₁=r₂","归一化 r₁+r₂=1"],"r=[.5,.5]"),sources:[ESL("14.10","14-Unsupervised-Learning/14.10-The-Google-PageRank-Algorithm.md")],tags:["ESL","PageRank","马尔可夫"],visual:"markov",
  },
  {
    id:"random-forest",title:"随机森林",category:"经典机器学习（ESL）",topic:"集成学习",
    latex:"\\hat f_{RF}(x)=\\frac1B\\sum_{b=1}^BT_b(x),\\qquad Var\\approx\\rho\\sigma^2+\\frac{1-\\rho}{B}\\sigma^2",explanation:"在 bagging 基础上每次分裂只看随机特征子集，从而降低树间相关性 ρ。",nature:"推导",
    variables:[V("T_b","第 b 棵随机树","bootstrap 样本+随机特征"),V("B","树数","平均规模"),V("ρ","树预测相关性","随机特征旨在降低它"),V("σ²","单树方差","通常较高")],
    derivation:[D("Var(\\bar T)=B^{-2}[B\\sigma^2+B(B-1)\\rho\\sigma^2]","展开 B 个等方差等相关预测的协方差和。"),D("=\\rho\\sigma^2+(1-\\rho)\\sigma^2/B","化简。"),D("B\\to\\infty\\Rightarrow Var\\to\\rho\\sigma^2","增树数只能消除非相关部分，因此去相关很关键。")],
    example:E("σ²=9,ρ=.2,B=100",["方差≈.2·9+.8·9/100"],"约1.872"),sources:[ESL("15.2","15-Random-Forests/15.2-Definition-of-Random-Forests.md"),ESL("15.4","15-Random-Forests/15.4-Analysis-of-Random-Forests.md")],tags:["ESL","随机森林"],visual:"generic",
  },
  {
    id:"stacking",title:"Stacking 集成",category:"经典机器学习（ESL）",topic:"集成学习",
    latex:"\\hat w=\\arg\\min_w\\sum_i\\left(y_i-\\sum_mw_m\\hat f_m^{-fold(i)}(x_i)\\right)^2",explanation:"用折外预测训练二级模型，学习如何组合不同基学习器，同时避免把训练内过拟合当成能力。",nature:"定义/构造",
    variables:[V("f_m^{-fold(i)}","未见样本 i 的第 m 个模型预测","折外特征"),V("w_m","组合权重","由二级回归学习"),V("m","基模型索引","遍历多个算法"),V("y_i","真实目标","二级模型监督信号")],
    derivation:[D("z_{im}=\\hat f_m^{-fold(i)}(x_i)","构造无泄漏的折外预测矩阵 Z。"),D("\\hat w=\\arg\\min_w\\|y-Zw\\|^2","在预测空间做最小二乘。"),D("\\hat f_{stack}(x)=\\sum_m\\hat w_m\\hat f_m^{full}(x)","基模型在全数据重训后按学得权重组合。")],
    example:E("两个模型折外预测列正交，ZᵀZ=I，Zᵀy=[.7,.3]",["w=(ZᵀZ)⁻¹Zᵀy"],"w=[.7,.3]"),sources:[ESL("8.8","08-Model-Inference-and-Averaging/8.8-Model-Averaging-and-Stacking.md"),ESL("16.3","16-Ensemble-Learning/16.3-Learning-Ensembles.md")],tags:["ESL","Stacking"],visual:"generic",
  },
  {
    id:"gaussian-graphical",title:"高斯图模型与精度矩阵",category:"经典机器学习（ESL）",topic:"图模型",
    latex:"X_i\\perp X_j|X_{-(i,j)}\\iff\\Theta_{ij}=0,\\qquad\\Theta=\\Sigma^{-1}",explanation:"多元高斯中，精度矩阵的零元素精确编码给定其余变量后的条件独立边。",nature:"推导",
    variables:[V("Σ","协方差矩阵","描述边缘相关"),V("Θ","精度矩阵","Σ 的逆"),V("Θ_ij","非对角元素","是否存在条件依赖边"),V("X_{-(i,j)}","除 i,j 外的变量","作为条件集")],
    derivation:[D("\\log p(x)=C+\\tfrac12\\log|\\Theta|-\\tfrac12x^T\\Theta x","写零均值高斯对数密度。"),D("x^T\\Theta x=\\sum_i\\Theta_{ii}x_i^2+2\\sum_{i<j}\\Theta_{ij}x_ix_j","展开二次型。"),D("\\Theta_{ij}=0","若交互项消失，固定其余变量后条件密度可因子化，得到条件独立。")],
    example:E("Θ=[[1,0,.2],[0,1,.3],[.2,.3,1]]",["Θ₁₂=0"],"X₁ 与 X₂ 在给定 X₃ 后条件独立"),sources:[ESL("17.3","17-Undirected-Graphical-Models/17.3-Undirected-Graphical-Models-for-Continuous-Variables.md")],tags:["ESL","图模型"],visual:"markov",
  },
  {
    id:"graphical-lasso",title:"Graphical Lasso",category:"经典机器学习（ESL）",topic:"高维图模型",
    latex:"\\hat\\Theta=\\arg\\min_{\\Theta\\succ0}[-\\log|\\Theta|+\\operatorname{tr}(S\\Theta)+\\lambda\\|\\Theta\\|_1]",explanation:"对高斯精度矩阵做 L₁ 正则最大似然，产生稀疏条件依赖图。",nature:"推导",
    variables:[V("Θ","正定精度矩阵","待估图结构"),V("S","样本协方差","数据统计量"),V("λ","稀疏强度","越大边越少"),V("tr","迹","把 SΘ 的对角求和")],
    derivation:[D("\\ell(\\Theta)=\\tfrac n2[\\log|\\Theta|-\\operatorname{tr}(S\\Theta)]+C","高斯样本的精度参数对数似然。"),D("-\\ell/n\\propto-\\log|\\Theta|+\\operatorname{tr}(S\\Theta)","转成最小化负对数似然并去常数。"),D("+\\lambda\\|\\Theta\\|_1","加入 L₁ 惩罚，使非对角元素可精确为0。")],
    example:E("某非对角项的似然梯度绝对值小于 λ",["KKT 条件可由 L₁ 在0处的次梯度区间满足"],"该边估计为0"),sources:[ESL("17.3","17-Undirected-Graphical-Models/17.3-Undirected-Graphical-Models-for-Continuous-Variables.md"),ESL("18.1","18-High-Dimensional-Problems/18.1-When-p-is-Much-Bigger-than-N.md")],tags:["ESL","高维","稀疏图"],visual:"markov",
  },
  {
    id:"fdr",title:"Benjamini–Hochberg FDR",category:"经典机器学习（ESL）",topic:"多重检验",
    latex:"k^*=\\max\\left\\{k:p_{(k)}\\le\\frac{k}{m}q\\right\\}",explanation:"把 p 值排序，找到仍低于线性阈值的最大位置，从而控制期望错误发现比例。",nature:"定义/构造",
    variables:[V("p_(k)","第 k 小的 p 值","升序排列"),V("m","总检验数","阈值分母"),V("q","目标 FDR 水平","如0.05"),V("k*","最大通过位置","拒绝前 k* 个假设")],
    derivation:[D("p_{(1)}\\le\\cdots\\le p_{(m)}","排序全部 p 值。"),D("t_k=kq/m","为第 k 位设置逐渐放宽的阈值。"),D("k^*=\\max\\{k:p_{(k)}\\le t_k\\}","取最后一个穿过阈值的位置。"),D("\\text{reject }H_{(1)},\\ldots,H_{(k^*)}","把前缀作为发现集合。")],
    example:E("m=4,q=.05，p=[.001,.01,.03,.2]",["阈值 [.0125,.025,.0375,.05]","前三个分别通过，第四个不通过"],"k*=3，拒绝前三个假设"),sources:[ESL("18.7","18-High-Dimensional-Problems/18.7-Feature-Assessment-and-the-Multiple-Testing-Problem.md")],tags:["ESL","FDR","高维"],visual:"distribution",
  },
];

const deepLearningFormulas: FormulaEntry[] = [
  {
    id:"affine-layer",title:"全连接层 / 仿射变换",category:"神经网络与深度学习",topic:"神经网络基础",
    latex:"\\mathbf z=W\\mathbf x+\\mathbf b",explanation:"每个输出神经元对输入做加权求和并加偏置，是神经网络最基本的可学习线性模块。",nature:"定义/构造",
    variables:[V("x","d 维输入向量","送入层"),V("W","m×d 权重矩阵","每行定义一个神经元"),V("b","m 维偏置","平移每个输出"),V("z","m 维预激活","再送给激活函数")],
    derivation:[D("z_j=\\sum_{i=1}^dW_{ji}x_i+b_j","单个神经元执行加权求和。"),D("z=[z_1,\\ldots,z_m]^T","把 m 个神经元输出堆叠。"),D("z=Wx+b","用矩阵乘法紧凑表示。")],
    example:E("W=[[1,2],[-1,1]],x=[3,4],b=[1,0]",["Wx=[11,1]","加 b 得 [12,1]"],"z=[12,1]"),sources:[ESL("11.3","11-Neural-Networks/11.3-Neural-Networks.md")],tags:["神经网络","线性层"],visual:"matrix",
  },
  {
    id:"sigmoid",title:"Sigmoid 激活",category:"神经网络与深度学习",topic:"激活函数",
    latex:"\\sigma(x)=\\frac1{1+e^{-x}},\\qquad\\sigma'(x)=\\sigma(x)[1-\\sigma(x)]",explanation:"把实数压到 (0,1)，适合概率输出；饱和区导数接近0，会造成梯度消失。",nature:"推导",
    variables:[V("x","预激活标量","任意实数"),V("σ(x)","激活输出","0到1"),V("e^{-x}","指数衰减项","控制 S 形曲线")],
    derivation:[D("\\sigma=(1+e^{-x})^{-1}","改写为幂函数。"),D("\\sigma'=-(1+e^{-x})^{-2}(-e^{-x})","链式法则。"),D("=e^{-x}/(1+e^{-x})^2=\\sigma(1-\\sigma)","利用 1-σ=e^{-x}/(1+e^{-x})。")],
    example:E("x=0",["σ(0)=1/2","σ'(0)=.5·.5"],"输出0.5，导数0.25"),sources:[ESL("11.3","11-Neural-Networks/11.3-Neural-Networks.md")],tags:["激活","Sigmoid"],visual:"activation",
  },
  {
    id:"tanh",title:"tanh 激活",category:"神经网络与深度学习",topic:"激活函数",
    latex:"\\tanh x=\\frac{e^x-e^{-x}}{e^x+e^{-x}},\\qquad(\\tanh x)'=1-\\tanh^2x",explanation:"输出位于 (-1,1) 且零中心；大绝对值区仍会饱和。",nature:"推导",
    variables:[V("x","预激活","实数输入"),V("tanh x","双曲正切输出","-1到1")],
    derivation:[D("u=e^x-e^{-x},\\;v=e^x+e^{-x}","把 tanh 写成商 u/v。"),D("(u/v)'=(u'v-uv')/v^2","应用商法则。"),D("=4/(e^x+e^{-x})^2=1-\\tanh^2x","代数化简。")],
    example:E("x=0",["tanh0=0","导数1-0²"],"输出0，导数1"),sources:[ESL("11.3","11-Neural-Networks/11.3-Neural-Networks.md")],tags:["激活","tanh"],visual:"activation",
  },
  {
    id:"relu",title:"ReLU 激活",category:"神经网络与深度学习",topic:"激活函数",
    latex:"\\operatorname{ReLU}(x)=\\max(0,x),\\qquad\\frac{d}{dx}=\\begin{cases}0&x<0\\\\1&x>0\\end{cases}",explanation:"正区间保持线性、负区间截断为0；计算简单并缓解正区间梯度消失。",nature:"定义/构造",
    variables:[V("x","预激活","与0比较"),V("ReLU(x)","非负输出","取0与x中较大者"),V("d/dx","局部梯度","x=0 处用约定次梯度")],
    derivation:[D("x<0\\Rightarrow\\max(0,x)=0","负半轴输出常数。"),D("x>0\\Rightarrow\\max(0,x)=x","正半轴为恒等映射。"),D("f'=0\\;(x<0),\\;1\\;(x>0)","分别对两段求导。")],
    example:E("输入 [-2,0,3]",["逐元素与0取最大"],"输出 [0,0,3]"),sources:[STD()],tags:["激活","ReLU"],visual:"activation",
  },
  {
    id:"gelu",title:"GELU 激活",category:"神经网络与深度学习",topic:"激活函数",
    latex:"\\operatorname{GELU}(x)=x\\Phi(x)\\approx\\frac{x}{2}\\left[1+\\tanh\\!\\left(\\sqrt{\\frac2\\pi}(x+0.044715x^3)\\right)\\right]",explanation:"把输入乘以其在标准正态门控下被保留的概率，平滑地衰减负值；Transformer 常用。",nature:"定义/构造",
    variables:[V("x","预激活","既作为值也决定门概率"),V("Φ(x)","标准正态 CDF","P(Z≤x)"),V("0.044715","近似系数","提高 tanh 逼近精度")],
    derivation:[D("m=\\mathbf1(Z\\le x),\\;Z\\sim N(0,1)","设随机门在阈值 x 下打开。"),D("E[xm]=xP(Z\\le x)=x\\Phi(x)","对门变量取期望。"),D("\\Phi(x)\\approx\\tfrac12[1+\\tanh(\\sqrt{2/\\pi}(x+0.044715x^3))]","用快速平滑近似替代 CDF。")],
    example:E("x=0",["Φ(0)=0.5","GELU(0)=0·.5"],"输出0；在小正值附近约保留一半"),sources:[STD()],tags:["激活","GELU","Transformer"],visual:"activation",
  },
  {
    id:"silu",title:"SiLU / Swish 激活",category:"神经网络与深度学习",topic:"激活函数",
    latex:"\\operatorname{SiLU}(x)=x\\sigma(x),\\qquad\\operatorname{SiLU}'(x)=\\sigma(x)+x\\sigma(x)[1-\\sigma(x)]",explanation:"输入由自身 sigmoid 门控，平滑且允许少量负输出；现代大模型常用。",nature:"推导",
    variables:[V("x","预激活","作为值和门输入"),V("σ(x)","门控比例","0到1"),V("SiLU","门控后的输出","x 与 σ 相乘")],
    derivation:[D("f=x\\sigma(x)","写成两个函数的乘积。"),D("f'=1\\cdot\\sigma+x\\sigma'","应用乘积法则。"),D("=\\sigma+x\\sigma(1-\\sigma)","代入 sigmoid 导数。")],
    example:E("x=0",["σ=.5","SiLU=0","导数=.5"],"过原点且斜率0.5"),sources:[STD()],tags:["激活","SiLU"],visual:"activation",
  },
  {
    id:"softmax",title:"Softmax",category:"神经网络与深度学习",topic:"输出层",
    latex:"p_i=\\frac{e^{z_i}}{\\sum_je^{z_j}},\\qquad\\frac{\\partial p_i}{\\partial z_j}=p_i(\\delta_{ij}-p_j)",explanation:"把任意 logits 转为和为1的类别概率；减最大 logit 可保持数值稳定而不改变结果。",nature:"推导",
    variables:[V("z_i","第 i 类 logit","未归一化分数"),V("p_i","第 i 类概率","非负且总和1"),V("δ_ij","Kronecker delta","i=j 为1否则0"),V("j","被求导的 logit 索引","形成雅可比")],
    derivation:[D("p_i=e^{z_i}/S,\\;S=\\sum_ke^{z_k}","定义公共归一化分母。"),D("\\partial p_i/\\partial z_j=\\delta_{ij}e^{z_i}/S-e^{z_i}e^{z_j}/S^2","商法则。"),D("=p_i(\\delta_{ij}-p_j)","识别两个 softmax 概率。")],
    example:E("z=[0,log2]",["指数 [1,2]","除以总和3"],"p=[1/3,2/3]"),sources:[ESL("11.3","11-Neural-Networks/11.3-Neural-Networks.md")],tags:["Softmax","分类"],visual:"activation",
  },
  {
    id:"mse-loss",title:"均方误差损失",category:"神经网络与深度学习",topic:"损失函数",
    latex:"L=\\frac1n\\sum_{i=1}^n(y_i-\\hat y_i)^2,\\qquad\\frac{\\partial L}{\\partial\\hat y_i}=\\frac2n(\\hat y_i-y_i)",explanation:"平方放大大误差；在高斯噪声假设下，最小化 MSE 等价于最大似然。",nature:"推导",
    variables:[V("y_i","真实目标","监督标签"),V("ŷ_i","模型预测","损失对其求导"),V("n","样本数","取平均"),V("L","批次均方误差","训练目标")],
    derivation:[D("L=n^{-1}\\sum_i(y_i-\\hat y_i)^2","定义平均平方残差。"),D("\\partial(y_i-\\hat y_i)^2/\\partial\\hat y_i=2(y_i-\\hat y_i)(-1)","链式法则。"),D("\\partial L/\\partial\\hat y_i=2(\\hat y_i-y_i)/n","乘平均系数并化简。")],
    example:E("y=[1,3]，ŷ=[2,1]",["平方误差 [1,4]","平均 (1+4)/2"],"MSE=2.5"),sources:[ESL("2.4","02-Overview-of-Supervised-Learning/2.4-Statistical-Decision-Theory.md")],tags:["损失","MSE"],visual:"curve",
  },
  {
    id:"binary-cross-entropy",title:"二元交叉熵",category:"神经网络与深度学习",topic:"损失函数",
    latex:"L=-[y\\log p+(1-y)\\log(1-p)],\\qquad\\frac{\\partial L}{\\partial z}=p-y\\;(p=\\sigma(z))",explanation:"伯努利负对数似然；与 sigmoid 合并后对 logit 的梯度简洁为预测减标签。",nature:"推导",
    variables:[V("y","二元标签","0或1"),V("p","预测正类概率","σ(z)"),V("z","logit","sigmoid 输入"),V("L","单样本负对数似然","需最小化")],
    derivation:[D("p(y|p)=p^y(1-p)^{1-y}","写伯努利似然。"),D("L=-\\log p(y|p)=-y\\log p-(1-y)\\log(1-p)","取负对数。"),D("\\partial L/\\partial p=(p-y)/[p(1-p)]","对 p 求导并通分。"),D("\\partial p/\\partial z=p(1-p)\\Rightarrow\\partial L/\\partial z=p-y","链式相乘，因子抵消。")],
    example:E("y=1,p=.8",["L=-log.8","对 logit 梯度 .8-1"],"L≈.223，梯度−.2"),sources:[ESL("4.4","04-Linear-Methods-for-Classification/4.4-Logistic-Regression.md")],tags:["损失","BCE"],visual:"activation",
  },
  {
    id:"backprop",title:"反向传播",category:"神经网络与深度学习",topic:"训练算法",
    latex:"\\bar x=\\frac{\\partial L}{\\partial x}=\\left(\\frac{\\partial y}{\\partial x}\\right)^T\\bar y",explanation:"从损失沿计算图逆序传播向量–雅可比乘积，复用中间结果高效计算所有参数梯度。",nature:"推导",
    variables:[V("x","某节点输入","需要其梯度"),V("y=f(x)","节点输出","下游使用"),V("L","标量损失","计算图终点"),V("bar y","L 对 y 的上游梯度","从后续节点传来"),V("J","y 对 x 的雅可比","局部导数")],
    derivation:[D("dL=\\bar y^Tdy","损失的全微分。"),D("dy=Jdx","节点的一阶线性化。"),D("dL=\\bar y^TJdx=(J^T\\bar y)^Tdx","代入并转置分组。"),D("\\bar x=J^T\\bar y","与 dL=bar xᵀdx 对比系数。")],
    example:E("y=x²，L=3y，在 x=2",["上游 bar y=3","局部 dy/dx=2x=4","bar x=4·3"],"dL/dx=12"),sources:[ESL("11.4","11-Neural-Networks/11.4-Fitting-Neural-Networks.md")],tags:["反向传播","梯度"],visual:"generic",
  },
  {
    id:"batchnorm",title:"Batch Normalization",category:"神经网络与深度学习",topic:"归一化",
    latex:"\\hat x_i=\\frac{x_i-\\mu_B}{\\sqrt{\\sigma_B^2+\\epsilon}},\\qquad y_i=\\gamma\\hat x_i+\\beta",explanation:"按小批次统计量标准化每个通道，再用可学习 γ、β 恢复合适尺度和偏移。",nature:"定义/构造",
    variables:[V("μ_B,σ_B²","批次均值与方差","沿批次维计算"),V("ε","稳定常数","避免零方差"),V("γ,β","可学习缩放和平移","逐通道参数"),V("x_i,y_i","输入与输出","先标准化再仿射")],
    derivation:[D("\\mu_B=m^{-1}\\sum_ix_i","计算批均值。"),D("\\sigma_B^2=m^{-1}\\sum_i(x_i-\\mu_B)^2","计算批方差。"),D("\\hat x_i=(x_i-\\mu_B)/\\sqrt{\\sigma_B^2+\\epsilon}","中心化并单位化。"),D("y_i=\\gamma\\hat x_i+\\beta","加入可学习的表示能力。")],
    example:E("批次 x=[1,3]，忽略ε，γ=2,β=1",["μ=2，σ²=1，x̂=[-1,1]","y=2x̂+1"],"y=[-1,3]"),sources:[STD()],tags:["BatchNorm","归一化"],visual:"distribution",
  },
  {
    id:"layernorm",title:"Layer Normalization",category:"神经网络与深度学习",topic:"归一化",
    latex:"\\operatorname{LN}(x)=\\gamma\\odot\\frac{x-\\mu}{\\sqrt{\\sigma^2+\\epsilon}}+\\beta,\\quad\\mu=\\frac1d\\sum_{j=1}^dx_j",explanation:"对单个 token 的特征维做标准化，不依赖批次大小，是 Transformer 的标准组件。",nature:"定义/构造",
    variables:[V("d","隐藏维数","统计量的归约范围"),V("μ,σ²","该 token 的特征均值方差","逐样本计算"),V("γ,β","逐特征可学习参数","Hadamard 缩放与平移"),V("⊙","逐元素乘法","同维向量对应相乘")],
    derivation:[D("\\mu=d^{-1}\\sum_jx_j","沿最后一维求均值。"),D("\\sigma^2=d^{-1}\\sum_j(x_j-\\mu)^2","沿同一维求方差。"),D("\\hat x=(x-\\mu)/\\sqrt{\\sigma^2+\\epsilon}","得到零均值单位方差表示。"),D("y=\\gamma\\odot\\hat x+\\beta","恢复每个特征的可学习尺度。")],
    example:E("x=[1,3]，γ=[1,1],β=0",["μ=2，σ²=1","x̂=[-1,1]"],"LN(x)=[-1,1]"),sources:[STD()],tags:["LayerNorm","Transformer"],visual:"distribution",
  },
  {
    id:"dropout",title:"Dropout",category:"神经网络与深度学习",topic:"正则化",
    latex:"\\tilde h_i=\\frac{m_i}{1-p}h_i,\\qquad m_i\\sim\\operatorname{Bernoulli}(1-p)",explanation:"训练时随机丢弃激活并做反向缩放，使期望保持不变；推理时不再采样。",nature:"推导",
    variables:[V("h_i","原激活","被随机门控"),V("m_i","0/1 掩码","保留概率1-p"),V("p","丢弃率","0到1"),V("h̃_i","训练时输出","除1-p保持期望")],
    derivation:[D("E[m_i]=1-p","伯努利均值。"),D("E[m_ih_i]=(1-p)h_i","掩码与固定激活相乘。"),D("E[m_ih_i/(1-p)]=h_i","反向缩放使训练输出无偏。")],
    example:E("h=4，p=.5",["保留时输出 4/.5=8","丢弃时输出0","期望 .5·8+.5·0"],"期望仍为4"),sources:[STD()],tags:["Dropout","正则化"],visual:"generic",
  },
  {
    id:"xavier-init",title:"Xavier 初始化",category:"神经网络与深度学习",topic:"初始化",
    latex:"\\operatorname{Var}(W_{ij})=\\frac{2}{n_{in}+n_{out}}",explanation:"折中保持前向激活和反向梯度方差，适合近似线性的 tanh/sigmoid 中央区域。",nature:"推导",
    variables:[V("n_in","输入扇入","每个输出汇聚的项数"),V("n_out","输出扇出","每个输入影响的单元数"),V("W_ij","独立零均值权重","按给定方差采样")],
    derivation:[D("Var(z_j)=n_{in}Var(W)Var(x)","独立零均值乘积求和的方差相加。"),D("Var(z)\\approx Var(x)\\Rightarrow Var(W)\\approx1/n_{in}","保持前向方差。"),D("Var(g_x)\\approx Var(g_z)\\Rightarrow Var(W)\\approx1/n_{out}","保持反向方差。"),D("Var(W)=2/(n_{in}+n_{out})","取两者调和折中。")],
    example:E("n_in=64,n_out=128",["Var=2/192"],"方差1/96，标准差约0.102"),sources:[STD()],tags:["初始化","Xavier"],visual:"distribution",
  },
  {
    id:"he-init",title:"He 初始化",category:"神经网络与深度学习",topic:"初始化",
    latex:"\\operatorname{Var}(W_{ij})=\\frac{2}{n_{in}}",explanation:"ReLU 大约截掉一半零均值激活，因而把权重方差加倍以维持前向信号尺度。",nature:"推导",
    variables:[V("n_in","输入扇入","求和项数"),V("W_ij","零均值权重","通常正态或均匀采样"),V("ReLU","半波整流","约保留一半二阶矩")],
    derivation:[D("E[z^2]=n_{in}Var(W)E[x^2]","线性预激活二阶矩。"),D("E[ReLU(z)^2]\\approx\\tfrac12E[z^2]","对称分布正半轴贡献一半。"),D("E[h^2]\\approx\\tfrac12n_{in}Var(W)E[x^2]","组合两步。"),D("Var(W)=2/n_{in}","令输出二阶矩等于输入。")],
    example:E("n_in=100",["Var=2/100=.02"],"标准差√.02≈.141"),sources:[STD()],tags:["初始化","He","ReLU"],visual:"distribution",
  },
  {
    id:"convolution",title:"二维卷积",category:"神经网络与深度学习",topic:"卷积网络",
    latex:"Y_{o,i,j}=\\sum_{c=1}^{C_{in}}\\sum_{u,v}K_{o,c,u,v}X_{c,i+u,j+v}+b_o",explanation:"同一局部核在空间位置共享，提取平移等变的局部模式；深度学习实现通常是互相关形式。",nature:"定义/构造",
    variables:[V("X","输入特征图","通道×高×宽"),V("K","卷积核","输出通道×输入通道×核高×核宽"),V("Y","输出特征图","每个位置的局部点积"),V("u,v","核内偏移","滑动窗口索引"),V("b_o","输出通道偏置","每个位置共享")],
    derivation:[D("P_{i,j}=X[:,i:i+k_h,j:j+k_w]","在位置 (i,j) 提取局部补丁。"),D("Y_{o,i,j}=\\langle K_o,P_{i,j}\\rangle+b_o","核与补丁逐元素乘加。"),D("Y_{o,i,j}\\text{ 对所有 }i,j\\text{ 使用同一 }K_o","权重共享带来平移等变与参数节省。")],
    example:E("一维 X=[1,2,3]，核 K=[1,-1]，步长1",["位置1:1-2=-1","位置2:2-3=-1"],"Y=[-1,-1]"),sources:[STD()],tags:["卷积","CNN"],visual:"matrix",
  },
  {
    id:"rnn",title:"循环神经网络（RNN）",category:"神经网络与深度学习",topic:"序列模型",
    latex:"h_t=\\phi(W_hh_{t-1}+W_xx_t+b),\\qquad y_t=W_yh_t",explanation:"把上一时刻隐状态与当前输入合并，权重跨时间共享；长序列中连乘雅可比会导致梯度消失/爆炸。",nature:"定义/构造",
    variables:[V("x_t","t 时刻输入","序列当前元素"),V("h_t","隐状态","汇总过去信息"),V("W_h,W_x","递归与输入权重","跨时间共享"),V("φ","非线性激活","如 tanh"),V("y_t","时刻输出","由隐状态线性映射")],
    derivation:[D("a_t=W_hh_{t-1}+W_xx_t+b","先组合历史与当前输入。"),D("h_t=\\phi(a_t)","通过非线性更新记忆。"),D("\\partial h_T/\\partial h_t=\\prod_{k=t+1}^T\\operatorname{diag}(\\phi'(a_k))W_h","链式法则沿时间展开。"),D("\\|\\prod J_k\\|\\text{ 随 T-t 指数缩小或放大}","解释梯度消失/爆炸。")],
    example:E("标量线性 RNN h_t=.5h_{t-1}+x_t，h₀=0，x=[2,2]",["h₁=2","h₂=.5·2+2"],"h₂=3"),sources:[STD()],tags:["RNN","序列"],visual:"generic",
  },
  {
    id:"lstm",title:"LSTM 单元",category:"神经网络与深度学习",topic:"序列模型",
    latex:"c_t=f_t\\odot c_{t-1}+i_t\\odot\\tilde c_t,\\qquad h_t=o_t\\odot\\tanh c_t",explanation:"遗忘门、输入门、输出门控制长期记忆；加法记忆通道让梯度更容易跨时间流动。",nature:"定义/构造",
    variables:[V("c_t","细胞状态","长期加法记忆"),V("h_t","对外隐状态","门控后的记忆"),V("f_t","遗忘门","保留旧记忆比例"),V("i_t","输入门","写入候选比例"),V("o_t","输出门","暴露记忆比例"),V("c̃_t","候选记忆","由当前输入生成")],
    derivation:[D("f_t,i_t,o_t=\\sigma(W[x_t,h_{t-1}]+b)","用 sigmoid 产生0到1的门。"),D("\\tilde c_t=\\tanh(W_c[x_t,h_{t-1}]+b_c)","构造候选内容。"),D("c_t=f_t\\odot c_{t-1}+i_t\\odot\\tilde c_t","保留与写入以加法合并。"),D("\\partial c_t/\\partial c_{t-1}=f_t","当 f 接近1时梯度可近似无衰减通过。")],
    example:E("c_{t-1}=2,f=.8,i=.5,c̃=.4,o=1",["c_t=.8·2+.5·.4=1.8","h_t=tanh1.8"],"h_t≈0.947"),sources:[STD()],tags:["LSTM","序列"],visual:"generic",
  },
  {
    id:"residual",title:"残差连接",category:"神经网络与深度学习",topic:"深层网络",
    latex:"y=x+F(x),\\qquad\\frac{\\partial L}{\\partial x}=\\frac{\\partial L}{\\partial y}\\left(I+\\frac{\\partial F}{\\partial x}\\right)",explanation:"让层只学习相对输入的残差，并给前向信号和反向梯度提供恒等捷径。",nature:"推导",
    variables:[V("x","块输入","通过捷径直达输出"),V("F(x)","残差分支","学习修正量"),V("y","块输出","逐元素相加"),V("I","恒等雅可比","保证直接梯度通道")],
    derivation:[D("y=x+F(x)","构造恒等映射加可学习扰动。"),D("dy/dx=I+J_F","加法的导数相加。"),D("\\bar x=(I+J_F)^T\\bar y","反向传播向量–雅可比乘积。"),D("\\bar x=\\bar y+J_F^T\\bar y","梯度包含不经过 F 的直接项。")],
    example:E("F(x)=2x，L=y，标量",["y=3x","dy/dx=1+2"],"梯度3，其中1来自捷径"),sources:[STD()],tags:["残差","ResNet","Transformer"],visual:"generic",
  },
];

const llmFormulas: FormulaEntry[] = [
  {
    id:"scaled-attention",title:"缩放点积注意力",category:"大模型 · MoE · 训练推理",topic:"Transformer",
    latex:"\\operatorname{Attention}(Q,K,V)=\\operatorname{softmax}\\!\\left(\\frac{QK^T}{\\sqrt{d_k}}+M\\right)V",explanation:"查询与键的相似度经缩放、掩码和 softmax 变成权重，再对值向量加权汇总。",nature:"推导",
    variables:[V("Q","查询矩阵","每行表示当前 token 想找什么"),V("K","键矩阵","每行表示 token 可被匹配的特征"),V("V","值矩阵","被聚合的内容"),V("d_k","键维度","用 √dₖ 稳定分数方差"),V("M","掩码","不可见位置加 −∞")],
    derivation:[D("s_{ij}=q_i^Tk_j","点积衡量查询 i 与键 j 的匹配度。"),D("Var(q^Tk)=d_k\\sigma^4","独立零均值分量相乘求和，方差随维数增长。"),D("\\tilde s=s/\\sqrt{d_k}","除以 √dₖ 让尺度近似与维度无关。"),D("a_{ij}=softmax_j(\\tilde s_{ij}+M_{ij}),\\;o_i=\\sum_ja_{ij}v_j","归一化为权重并汇总值。")],
    example:E("单查询分数 [0,log2]，值 [10,4]",["softmax 权重 [1/3,2/3]","输出 10/3+8/3"],"注意力输出6"),sources:[STD()],tags:["Attention","Transformer"],visual:"attention",
  },
  {
    id:"multi-head",title:"多头注意力",category:"大模型 · MoE · 训练推理",topic:"Transformer",
    latex:"\\operatorname{MHA}(X)=\\operatorname{Concat}(head_1,\\ldots,head_H)W_O,\\quad head_h=Attention(XW_Q^h,XW_K^h,XW_V^h)",explanation:"多个头在不同子空间并行建立关系，拼接后再投影回模型维度。",nature:"定义/构造",
    variables:[V("H","注意力头数","并行子空间数"),V("W_Q^h,W_K^h,W_V^h","第 h 头投影矩阵","生成该头 Q/K/V"),V("W_O","输出投影","混合所有头"),V("X","序列隐藏状态","长度×模型维度")],
    derivation:[D("Q_h=XW_Q^h,\\;K_h=XW_K^h,\\;V_h=XW_V^h","把同一输入投到 H 个子空间。"),D("head_h=softmax(Q_hK_h^T/\\sqrt{d_h})V_h","每头独立做注意力。"),D("O=[head_1;\\ldots;head_H]W_O","沿特征维拼接并线性混合。")],
    example:E("2 个头，每头输出维2",["拼接后每 token 维度4","若 W_O 为4×4，输出仍维4"],"头数改变内部并行关系，不改变模型外部宽度"),sources:[STD()],tags:["MHA","Transformer"],visual:"attention",
  },
  {
    id:"sinusoidal-position",title:"正弦位置编码",category:"大模型 · MoE · 训练推理",topic:"Transformer",
    latex:"PE_{pos,2i}=\\sin(pos/10000^{2i/d}),\\qquad PE_{pos,2i+1}=\\cos(pos/10000^{2i/d})",explanation:"用多频率正弦/余弦为 token 注入绝对位置；位移可以由每个频率上的线性旋转表达。",nature:"定义/构造",
    variables:[V("pos","token 位置索引","0,1,2…"),V("i","频率通道索引","每对维度共享频率"),V("d","模型维度","决定频率跨度"),V("10000","频率基数","覆盖短到长周期")],
    derivation:[D("\\omega_i=10000^{-2i/d}","按指数尺度选一组角频率。"),D("PE_{2i}=\\sin(pos\\omega_i),\\;PE_{2i+1}=\\cos(pos\\omega_i)","每个频率用正交相位对编码。"),D("[\\sin((p+k)\\omega),\\cos((p+k)\\omega)]^T=R(k\\omega)[\\sin(p\\omega),\\cos(p\\omega)]^T","和角公式表明相对位移是线性旋转。")],
    example:E("pos=0",["所有 sin 通道为0","所有 cos 通道为1"],"PE(0)=[0,1,0,1,…]"),sources:[STD()],tags:["位置编码","Transformer"],visual:"curve",
  },
  {
    id:"rope",title:"旋转位置编码（RoPE）",category:"大模型 · MoE · 训练推理",topic:"Transformer",
    latex:"q_m^Tk_n=(R_mq)^T(R_nk)=q^TR_{n-m}k",explanation:"按位置旋转每对特征维，使注意力点积天然只依赖相对位置 n−m。",nature:"推导",
    variables:[V("q,k","未编码查询与键","按二维对分组"),V("R_m,R_n","位置 m,n 的块旋转矩阵","每对维度角频率不同"),V("m,n","查询与键位置","差值进入相似度")],
    derivation:[D("\\tilde q_m=R_mq,\\;\\tilde k_n=R_nk","对 Q/K 应用位置旋转。"),D("\\tilde q_m^T\\tilde k_n=q^TR_m^TR_nk","展开点积。"),D("R_m^TR_n=R_{n-m}","旋转矩阵逆等于转置，角度相减。"),D("q_m^Tk_n=q^TR_{n-m}k","相似度显式依赖相对位移。")],
    example:E("二维 q=k=[1,0]，角频率1，m=1,n=3",["相对角度2","点积=cos2"],"位置差决定相似度"),sources:[STD()],tags:["RoPE","位置编码"],visual:"attention",
  },
  {
    id:"causal-mask",title:"因果掩码",category:"大模型 · MoE · 训练推理",topic:"自回归建模",
    latex:"M_{ij}=\\begin{cases}0&j\\le i\\\\-\\infty&j>i\\end{cases},\\qquad A=softmax(S+M)",explanation:"第 i 个 token 只能查看自身和过去；未来位置加 −∞ 后 softmax 权重严格为0。",nature:"定义/构造",
    variables:[V("i","查询位置","当前预测位置"),V("j","键位置","被查看的位置"),V("S","原始注意力分数矩阵","QKᵀ/√d"),V("M","上三角掩码","未来位置为负无穷")],
    derivation:[D("j>i\\Rightarrow M_{ij}=-\\infty","标记未来位置不可见。"),D("e^{S_{ij}+M_{ij}}=e^{-\\infty}=0","softmax 分子变为0。"),D("A_{ij}=0\\;(j>i)","归一化后未来权重保持0。")],
    example:E("位置 i=2，序列长度4",["可见 j=1,2","j=3,4 的权重为0"],"注意力行形如 [a,b,0,0]"),sources:[STD()],tags:["因果注意力","Mask"],visual:"attention",
  },
  {
    id:"next-token-nll",title:"自回归负对数似然",category:"大模型 · MoE · 训练推理",topic:"训练目标",
    latex:"L_{NLL}=-\\sum_{t=1}^T\\log p_\\theta(x_t|x_{<t})",explanation:"用概率链式法则把序列似然分成逐 token 条件概率；教师强制训练等价于 token 交叉熵求和。",nature:"推导",
    variables:[V("x_t","第 t 个真实 token","训练目标"),V("x_<t","真实前缀","作为模型条件"),V("θ","模型参数","通过梯度更新"),V("T","序列长度","损失求和范围")],
    derivation:[D("p_\\theta(x_{1:T})=\\prod_{t=1}^Tp_\\theta(x_t|x_{<t})","应用概率链式法则。"),D("\\log p_\\theta(x_{1:T})=\\sum_t\\log p_\\theta(x_t|x_{<t})","取对数把乘积变和。"),D("L=-\\log p_\\theta(x_{1:T})","最大化似然等价于最小化负对数似然。")],
    example:E("三个 token 的正确词概率 [.5,.8,.25]",["序列概率=.5·.8·.25=.1","NLL=−log.1"],"NLL≈2.303 nat"),sources:[STD()],tags:["语言模型","NLL","训练"],visual:"generic",
  },
  {
    id:"perplexity",title:"困惑度（Perplexity）",category:"大模型 · MoE · 训练推理",topic:"评估指标",
    latex:"PPL=\\exp\\left[-\\frac1T\\sum_{t=1}^T\\log p(x_t|x_{<t})\\right]",explanation:"平均 token 负对数似然的指数，可理解为模型在每步等效面对的候选分支数。",nature:"定义/构造",
    variables:[V("T","被评估 token 数","平均分母"),V("p(x_t|x_<t)","真实 token 概率","由模型 softmax 给出"),V("exp","指数函数","把 log 尺度恢复到分支尺度")],
    derivation:[D("\\bar L=T^{-1}\\sum_t-\\log p_t","计算平均 token NLL。"),D("PPL=e^{\\bar L}","对平均信息量取指数。"),D("p_t=1/K\\;\\forall t\\Rightarrow PPL=K","均匀 K 类时困惑度正好为 K。")],
    example:E("每个真实 token 概率都为0.25",["平均 NLL=−log.25=log4","PPL=e^{log4}"],"PPL=4"),sources:[STD()],tags:["PPL","评估"],visual:"distribution",
  },
  {
    id:"label-smoothing",title:"标签平滑",category:"大模型 · MoE · 训练推理",topic:"训练稳定性",
    latex:"q_k=(1-\\varepsilon)\\mathbf1(k=y)+\\frac{\\varepsilon}{K},\\qquad L=-\\sum_kq_k\\log p_k",explanation:"把 one-hot 目标与均匀分布混合，抑制过度自信并给非目标类少量梯度。",nature:"定义/构造",
    variables:[V("ε","平滑系数","0到1"),V("K","类别/词表大小","均匀质量分母"),V("y","真实类别","主概率位置"),V("q_k","平滑目标概率","总和为1"),V("p_k","模型预测概率","交叉熵输入")],
    derivation:[D("q=(1-\\varepsilon)e_y+\\varepsilon u,\\;u_k=1/K","把 one-hot 与均匀分布做凸组合。"),D("\\sum_kq_k=(1-\\varepsilon)+\\varepsilon=1","目标仍归一化。"),D("L=H(q,p)=(1-\\varepsilon)(-\\log p_y)+\\varepsilon H(u,p)","交叉熵线性分解。")],
    example:E("K=4,ε=.2,真实类2",["每类均匀份额 .05","真实类 .8+.05=.85，其余 .05"],"q=[.05,.85,.05,.05]"),sources:[STD()],tags:["标签平滑","正则化"],visual:"distribution",
  },
  {
    id:"gradient-clipping",title:"梯度范数裁剪",category:"大模型 · MoE · 训练推理",topic:"训练稳定性",
    latex:"g\\leftarrow g\\cdot\\min\\left(1,\\frac{c}{\\|g\\|_2+\\epsilon}\right)",explanation:"当全局梯度范数超过阈值 c 时等比例缩小，保持方向但限制更新幅度。",nature:"定义/构造",
    variables:[V("g","所有参数梯度拼接向量","先计算全局 L₂ 范数"),V("c","最大允许范数","正阈值"),V("ε","稳定项","避免0除"),V("min","缩放上限","小梯度保持不变")],
    derivation:[D("s=\\min(1,c/(\\|g\\|+\\epsilon))","构造不超过1的缩放因子。"),D("\\|sg\\|=s\\|g\\|","标量缩放范数。"),D("\\|g\\|>c\\Rightarrow\\|sg\\|\\approx c;\\;\\|g\\|\\le c\\Rightarrow s=1","验证两种情况。")],
    example:E("||g||=10，阈值 c=2",["s=2/10=.2","新范数 .2·10"],"新范数2，方向不变"),sources:[STD()],tags:["梯度裁剪","稳定训练"],visual:"optimization",
  },
  {
    id:"adamw",title:"AdamW 解耦权重衰减",category:"大模型 · MoE · 训练推理",topic:"优化器",
    latex:"\\theta_t=(1-\\eta\\lambda)\\theta_{t-1}-\\eta\\frac{\\hat m_t}{\\sqrt{\\hat v_t}+\\epsilon}",explanation:"把权重衰减直接作用于参数，而非把 L₂ 梯度混入 Adam 的自适应归一化。",nature:"推导",
    variables:[V("θ","模型权重","被衰减和优化"),V("η","学习率","同时缩放两项"),V("λ","权重衰减率","控制参数收缩"),V("m̂,v̂","Adam 偏差修正矩","决定数据梯度步")],
    derivation:[D("\\theta'=(1-\\eta\\lambda)\\theta","先执行乘性衰减。"),D("u=\\hat m/(\\sqrt{\\hat v}+\\epsilon)","计算 Adam 自适应更新。"),D("\\theta_{new}=\\theta'-\\eta u","再应用数据梯度步。"),D("=(1-\\eta\\lambda)\\theta-\\eta u","合并为单式。")],
    example:E("θ=10,η=.01,λ=.1，忽略梯度项",["衰减因子 .999","新 θ=9.99"],"单步缩小0.01"),sources:[STD()],tags:["AdamW","权重衰减"],visual:"optimization",
  },
  {
    id:"loss-scaling",title:"混合精度损失缩放",category:"大模型 · MoE · 训练推理",topic:"训练稳定性",
    latex:"L'=sL,\\qquad g'=\\nabla_\\theta L'=sg,\\qquad g=g'/s",explanation:"先放大损失让小梯度留在低精度可表示范围，反向后再除回缩放因子。",nature:"推导",
    variables:[V("L","原始损失","标量"),V("s","损失缩放因子","通常较大的2次幂"),V("g'","缩放后的梯度","低精度反向计算"),V("g","恢复后的真实梯度","优化器使用")],
    derivation:[D("L'=sL","把损失整体乘常数。"),D("\\nabla L'=s\\nabla L","微分线性性。"),D("g=g'/s","优化器前反缩放，数学更新与原损失一致。")],
    example:E("真实梯度 10⁻⁸，s=2²⁰≈10⁶",["缩放梯度约10⁻²，可表示","反缩放后恢复10⁻⁸"],"避免反向阶段下溢"),sources:[STD()],tags:["混合精度","训练"],visual:"optimization",
  },
  {
    id:"sft",title:"监督微调（SFT）目标",category:"大模型 · MoE · 训练推理",topic:"对齐训练",
    latex:"L_{SFT}=-\\sum_{t\\in\\mathcal A}\\log\\pi_\\theta(y_t|x,y_{<t})",explanation:"只在助手回答 token 集合 A 上计算条件语言模型损失，提示 token 通常作为条件而不计损失。",nature:"定义/构造",
    variables:[V("x","用户提示/上下文","条件输入"),V("y_t","第 t 个目标回答 token","教师强制标签"),V("A","参与损失的助手 token 索引集","掩掉提示与填充"),V("π_θ","待微调语言模型","给下一 token 分布")],
    derivation:[D("p_\\theta(y|x)=\\prod_tp_\\theta(y_t|x,y_{<t})","对回答应用条件链式法则。"),D("-\\log p_\\theta(y|x)=-\\sum_t\\log p_\\theta(y_t|x,y_{<t})","取负对数。"),D("L_{SFT}=-\\sum_{t\\in A}\\log p_t","用损失掩码只监督回答位置。")],
    example:E("回答3个 token，正确概率 [.8,.5,.25]",["SFT loss=−log(.8·.5·.25)"],"约2.303 nat"),sources:[STD()],tags:["SFT","对齐"],visual:"generic",
  },
  {
    id:"dpo",title:"直接偏好优化（DPO）",category:"大模型 · MoE · 训练推理",topic:"对齐训练",
    latex:"L_{DPO}=-\\log\\sigma\\!\\left(\\beta\\left[\\log\\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)}-\\log\\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)}\\right]\\right)",explanation:"提高偏好回答相对参考模型的对数优势，同时降低被拒回答的相对优势；无需显式训练奖励模型。",nature:"推导",
    variables:[V("y_w,y_l","偏好/拒绝回答","成对比较"),V("π_θ","待优化策略","语言模型概率"),V("π_ref","冻结参考策略","约束偏离"),V("β","偏好强度/温度","缩放 log-ratio 差"),V("σ","sigmoid","把优势差映射为偏好概率")],
    derivation:[D("r_\\theta(x,y)=\\beta\\log[\\pi_\\theta(y|x)/\\pi_{ref}(y|x)]","KL 正则最优策略可反解隐式奖励。"),D("P(y_w\\succ y_l)=\\sigma(r_\\theta(x,y_w)-r_\\theta(x,y_l))","用 Bradley–Terry 偏好模型。"),D("L=-\\log P(y_w\\succ y_l)","最大化观测偏好的似然。"),D("\\text{代入 }r_\\theta","得到 DPO 目标。")],
    example:E("相对 log-ratio：赢者0.6，输者0.1，β=2",["logit=2(.6-.1)=1","loss=−logσ(1)"],"约0.313"),sources:[STD()],tags:["DPO","偏好优化"],visual:"optimization",
  },
  {
    id:"moe-router",title:"MoE 路由概率",category:"大模型 · MoE · 训练推理",topic:"混合专家",
    latex:"p_e(x)=\\operatorname{softmax}_e(W_rx/\\tau)",explanation:"路由器把 token 表示映射为各专家分数，再经温度 softmax 得到门控概率。",nature:"定义/构造",
    variables:[V("x","token 隐状态","路由输入"),V("W_r","路由权重矩阵","每行对应一个专家"),V("e","专家索引","1…E"),V("τ","路由温度","小则更尖锐"),V("p_e","选择专家概率","总和1")],
    derivation:[D("z=W_rx","线性层生成 E 个专家 logits。"),D("\\tilde z=z/\\tau","温度缩放控制分布尖锐度。"),D("p_e=e^{\\tilde z_e}/\\sum_je^{\\tilde z_j}","softmax 归一化。")],
    example:E("两专家 logits [0,log3]，τ=1",["指数 [1,3]","归一化"],"路由概率 [.25,.75]"),sources:[ESL("9.5","09-Additive-Models-Trees-and-Related-Methods/9.5-Hierarchical-Mixtures-of-Experts.md"),STD("现代稀疏 MoE")],tags:["MoE","路由"],visual:"moe",
  },
  {
    id:"moe-topk",title:"Top-k 专家聚合",category:"大模型 · MoE · 训练推理",topic:"混合专家",
    latex:"y(x)=\\sum_{e\\in TopK(p(x))}\\tilde p_e(x)E_e(x),\\qquad\\tilde p_e=\\frac{p_e}{\\sum_{j\\in TopK}p_j}",explanation:"每个 token 只执行概率最高的 k 个专家，并在选中集合内重新归一化门权重。",nature:"定义/构造",
    variables:[V("TopK","选中专家集合","按 p 从大到小取 k 个"),V("E_e","第 e 个专家网络","通常为独立 FFN"),V("p_e","原路由概率","softmax 输出"),V("p̃_e","选中后归一化权重","选中集合内和为1"),V("y","MoE 输出","专家输出加权和")],
    derivation:[D("S=TopK(p)","先稀疏选择 k 个专家。"),D("Z=\\sum_{j\\in S}p_j", "计算保留概率总量。"),D("\\tilde p_e=p_e/Z\\;(e\\in S)","集合内重新归一化。"),D("y=\\sum_{e\\in S}\\tilde p_eE_e(x)","只计算并混合选中专家。")],
    example:E("p=[.6,.3,.1]，top-2，专家标量输出 [2,8,100]",["选前两项，Z=.9","权重 [2/3,1/3]","y=2/3·2+1/3·8"],"y=4；第三专家不计算"),sources:[STD("现代稀疏 MoE")],tags:["MoE","Top-k"],visual:"moe",
  },
  {
    id:"moe-load-balance",title:"MoE 负载均衡损失",category:"大模型 · MoE · 训练推理",topic:"混合专家",
    latex:"L_{aux}=E\\sum_{e=1}^Ef_ep_e,\\quad f_e=\\frac1T\\sum_t\\mathbf1[e\\in TopK_t],\\quad p_e=\\frac1T\\sum_tP_{t,e}",explanation:"同时惩罚实际派发比例 f 与平均路由概率 p 集中到相同专家，降低专家坍缩。",nature:"定义/构造",
    variables:[V("E","专家数","外层缩放和求和"),V("T","token 数","统计批次负载"),V("f_e","专家 e 实际接收比例","离散 top-k 计数"),V("p_e","专家 e 平均软概率","可微路由信号"),V("L_aux","辅助损失","乘小系数加入主损失")],
    derivation:[D("f_e=T^{-1}\\sum_t1[e\\in TopK_t]","统计硬路由负载。"),D("p_e=T^{-1}\\sum_tP_{t,e}","统计软路由偏好。"),D("L_{aux}=E\\langle f,p\\rangle","若同一专家同时高 f、高 p，内积增大。"),D("f=p=(1/E,\\ldots,1/E)\\Rightarrow L_{aux}=1","均匀路由给出基准最小形态。")],
    example:E("E=2，f=p=[.9,.1]",["L=2(.9²+.1²)=1.64","均匀时 L=1"],"不均衡产生额外惩罚0.64"),sources:[STD("现代稀疏 MoE")],tags:["MoE","负载均衡"],visual:"moe",
  },
  {
    id:"moe-capacity",title:"MoE 专家容量",category:"大模型 · MoE · 训练推理",topic:"混合专家",
    latex:"C=\\left\\lceil\\frac{T\\,k}{E}\\cdot CF\\right\\rceil",explanation:"按平均每专家 token 数乘容量因子 CF 分配缓冲区；超出的 token 需要丢弃、溢出或重路由。",nature:"定义/构造",
    variables:[V("T","本批 token 数","路由对象数量"),V("k","每 token 选专家数","总派发数为 Tk"),V("E","专家数","平均分摊"),V("CF","容量因子","≥1 提供冗余"),V("C","每专家容量","向上取整")],
    derivation:[D("N_{dispatch}=Tk","每个 token 派发 k 次。"),D("N_{avg}=Tk/E","理想均衡下每专家平均负载。"),D("C=\\lceil CF\\cdot N_{avg}\\rceil","乘冗余因子并取整数容量。")],
    example:E("T=1024,k=2,E=8,CF=1.25",["平均负载=1024·2/8=256","容量=ceil(256·1.25)"],"每专家容量320"),sources:[STD("现代稀疏 MoE")],tags:["MoE","容量"],visual:"moe",
  },
  {
    id:"router-zloss",title:"路由器 z-loss",category:"大模型 · MoE · 训练推理",topic:"混合专家",
    latex:"L_z=\\frac1T\\sum_{t=1}^T\\left(\\log\\sum_{e=1}^E e^{z_{t,e}}\\right)^2",explanation:"惩罚路由 logits 的 log-sum-exp 过大，限制数值尺度并提升训练稳定性。",nature:"定义/构造",
    variables:[V("z_t,e","token t 对专家 e 的路由 logit","softmax 前分数"),V("E","专家数","log-sum-exp 范围"),V("T","token 数","批次平均"),V("L_z","路由稳定损失","常乘很小权重")],
    derivation:[D("a_t=\\log\\sum_ee^{z_{t,e}}","提取 softmax 的对数归一化常数。"),D("L_z=T^{-1}\\sum_ta_t^2","对过大正负尺度做对称二次惩罚。"),D("\\partial L_z/\\partial z_{t,e}=2a_t\\,softmax(z_t)_e/T","梯度按路由概率分配回 logits。")],
    example:E("单 token 两个 logits 都为0",["a=log2","L_z=(log2)²"],"约0.480"),sources:[STD("现代稀疏 MoE")],tags:["MoE","z-loss"],visual:"moe",
  },
  {
    id:"kv-cache",title:"KV Cache 递增推理",category:"大模型 · MoE · 训练推理",topic:"推理",
    latex:"K_{1:t}=[K_{1:t-1};k_t],\\quad V_{1:t}=[V_{1:t-1};v_t],\\quad o_t=softmax(q_tK_{1:t}^T/\\sqrt d)V_{1:t}",explanation:"历史 token 的 K/V 不再重复计算；每步只产生新 q/k/v 并与缓存历史做注意力。",nature:"定义/构造",
    variables:[V("q_t,k_t,v_t","新 token 的查询/键/值","本步计算"),V("K_1:t,V_1:t","累计缓存","沿序列维追加"),V("t","当前解码长度","注意力读取 t 个历史位置"),V("o_t","新 token 注意力输出","只需输出最后位置")],
    derivation:[D("K_{1:t}=[K_{1:t-1};k_t]","复用前 t−1 个键并追加新键。"),D("V_{1:t}=[V_{1:t-1};v_t]","值同样追加。"),D("o_t=Attention(q_t,K_{1:t},V_{1:t})","只对新查询计算一行注意力。"),D("\\text{每步投影由重算 }O(t)\\text{ 降为 }O(1)","缓存节省历史 K/V 投影，但注意力读缓存仍随 t 增长。")],
    example:E("已缓存3个 token，生成第4个",["只计算 k₄,v₄ 并追加","q₄ 与4个键点积"],"无需重新计算前3个 token 的 K/V"),sources:[STD()],tags:["KV Cache","推理"],visual:"attention",
  },
  {
    id:"temperature-sampling",title:"温度采样",category:"大模型 · MoE · 训练推理",topic:"解码",
    latex:"p_i(T)=\\frac{e^{z_i/T}}{\\sum_je^{z_j/T}}",explanation:"T<1 放大 logit 差使输出更确定，T>1 压平分布增加随机性；T→0 趋于 argmax。",nature:"定义/构造",
    variables:[V("z_i","词 i 的 logit","模型原始分数"),V("T","采样温度","正数"),V("p_i(T)","温度调整后的概率","再做随机采样")],
    derivation:[D("\\log[p_i/p_j]=(z_i-z_j)/T","softmax 概率比取对数。"),D("T<1\\Rightarrow |\\log(p_i/p_j)|\\text{ 放大}","高分词相对更占优势。"),D("T>1\\Rightarrow |\\log(p_i/p_j)|\\text{ 缩小}","分布更平坦。")],
    example:E("logits [0,1]",["T=1 时概率约 [.269,.731]","T=.5 时用 [0,2]，概率约 [.119,.881]"],"降温使高分词更确定"),sources:[STD()],tags:["采样","温度"],visual:"distribution",
  },
  {
    id:"top-p",title:"Top-p（核采样）",category:"大模型 · MoE · 训练推理",topic:"解码",
    latex:"S_p=\\min\\left\\{S:\\sum_{i\\in S}p_{(i)}\\ge p\\right\\},\\qquad\\tilde p_i=\\frac{p_i\\mathbf1(i\\in S_p)}{\\sum_{j\\in S_p}p_j}",explanation:"按概率降序取最小前缀，使累计质量达到阈值 p，再在该动态词集内重归一化采样。",nature:"定义/构造",
    variables:[V("p_(i)","第 i 大 token 概率","降序排列"),V("p","累计概率阈值","如0.9"),V("S_p","保留 token 集合","大小随分布变化"),V("p̃_i","截断后概率","集合内和为1")],
    derivation:[D("p_{(1)}\\ge p_{(2)}\\ge\\cdots","把 token 概率降序。"),D("k^*=\\min\\{k:\\sum_{i=1}^kp_{(i)}\\ge p\\}","找到达到累计阈值的最短前缀。"),D("S_p=\\{(1),\\ldots,(k^*)\\}","只保留前缀。"),D("\\tilde p_i=p_i/\\sum_{j\\in S_p}p_j","重新归一化后采样。")],
    example:E("概率 [.5,.3,.15,.05]，p=.8",["前1项累计.5不足","前2项累计.8达到"],"保留前2词，重归一化为 [.625,.375]"),sources:[STD()],tags:["Top-p","采样"],visual:"distribution",
  },
  {
    id:"quantization",title:"线性整数/权重量化",category:"大模型 · MoE · 训练推理",topic:"推理",
    latex:"q=\\operatorname{clip}(\\operatorname{round}(x/s)+z,q_{min},q_{max}),\\qquad\\hat x=s(q-z)",explanation:"用尺度 s 和零点 z 把浮点数映到有限整数格，再反量化近似原值。",nature:"定义/构造",
    variables:[V("x","原浮点值","待压缩"),V("s","量化尺度","相邻整数格间距"),V("z","零点","让实数0可精确表示"),V("q","整数码","限制在位宽范围"),V("x̂","反量化近似","供计算或误差分析")],
    derivation:[D("u=x/s+z","把实数按步长缩放并平移到整数坐标。"),D("q=clip(round(u),q_{min},q_{max})","取最近格点并饱和到合法范围。"),D("\\hat x=s(q-z)","逆变换回实数域。"),D("|x-\\hat x|\\le s/2\\text{（未饱和）}","四舍五入最大误差半个量化步。")],
    example:E("x=.73,s=.1,z=0，8位有符号",["x/s=7.3，round=7","x̂=.1·7"],"量化值7，反量化.7，误差.03"),sources:[STD()],tags:["量化","推理"],visual:"curve",
  },
  {
    id:"speculative-decoding",title:"推测解码接受率",category:"大模型 · MoE · 训练推理",topic:"推理",
    latex:"a(x)=\\min\\left(1,\\frac{p(x)}{q(x)}\\right)",explanation:"草稿模型 q 提议 token，目标模型 p 以校正概率接受；拒绝时从残差分布采样，最终分布仍为 p。",nature:"推导",
    variables:[V("q(x)","草稿模型提议概率","生成候选"),V("p(x)","目标模型概率","定义正确输出分布"),V("a(x)","候选接受概率","0到1"),V("x","提议 token","接受或修正")],
    derivation:[D("P(\\text{提议并接受 }x)=q(x)a(x)","联合发生概率。"),D("q(x)a(x)=q(x)\\min(1,p(x)/q(x))=\\min(q(x),p(x))","代入接受率。"),D("p(x)-\\min(p(x),q(x))=(p(x)-q(x))_+","目标概率中未由接受部分覆盖的残差。"),D("\\text{从归一化残差采样补齐}","接受质量加残差质量恰好恢复 p。")],
    example:E("某 token q=.2,p=.5",["a=min(1,.5/.2)=1"],"该提议必接受；若 q=.5,p=.2，接受率.4"),sources:[STD()],tags:["推测解码","推理加速"],visual:"distribution",
  },
];

const rlFormulas: FormulaEntry[] = [
  {
    id:"markov-property",title:"马尔可夫性",category:"强化学习与马尔可夫过程",topic:"马尔可夫链",
    latex:"P(S_{t+1}|S_t,S_{t-1},\\ldots,S_0)=P(S_{t+1}|S_t)",explanation:"给定当前状态后，未来与更早历史条件独立；关键不在“世界无记忆”，而在状态是否包含预测未来所需的信息。",nature:"定义/构造",
    variables:[V("S_t","t 时刻状态","应是充分的历史摘要"),V("S_{t+1}","下一状态","要预测的随机变量"),V("S_0…S_{t-1}","完整过去","在给定 S_t 后可丢弃")],
    derivation:[D("H_t=(S_0,\\ldots,S_t)","先把完整历史记为 H_t。"),D("P(S_{t+1}|H_t)=P(S_{t+1}|S_t)","若 S_t 是关于下一步的充分统计量。"),D("S_{t+1}\\perp H_{t-1}|S_t","等价地写成条件独立。")],
    example:E("棋盘状态包含所有棋子位置和轮到谁",["给定当前完整棋盘，下一步合法分布无需知道此前走法"],"完整棋盘状态可满足马尔可夫性"),sources:[ESL("17.2","17-Undirected-Graphical-Models/17.2-Markov-Graphs-and-Their-Properties.md"),STD()],tags:["马尔可夫","条件独立"],visual:"markov",
  },
  {
    id:"transition-matrix",title:"转移矩阵",category:"强化学习与马尔可夫过程",topic:"马尔可夫链",
    latex:"P_{ij}=P(S_{t+1}=j|S_t=i),\\qquad\\sum_jP_{ij}=1",explanation:"每一行是从当前状态 i 出发的下一状态分布；行随机矩阵完整描述齐次有限马尔可夫链。",nature:"定义/构造",
    variables:[V("P","转移矩阵","行对应当前状态，列对应下一状态"),V("i,j","当前与下一状态索引","遍历状态空间"),V("P_ij","一步转移概率","非负且每行和1")],
    derivation:[D("P_{ij}=P(S_{t+1}=j|S_t=i)","把所有一步条件概率排列成矩阵。"),D("\\sum_jP_{ij}=P(S_{t+1}\\in\\mathcal S|S_t=i)=1","下一状态必落在某个 j。"),D("\\mu_{t+1}^T=\\mu_t^TP","对当前分布按全概率公式传播。")],
    example:E("P=[[.8,.2],[.1,.9]]，μ₀=[1,0]",["μ₁=μ₀P"],"μ₁=[.8,.2]"),sources:[STD()],tags:["马尔可夫链","转移矩阵"],visual:"markov",
  },
  {
    id:"chapman-kolmogorov",title:"Chapman–Kolmogorov 方程",category:"强化学习与马尔可夫过程",topic:"马尔可夫链",
    latex:"P^{(m+n)}_{ij}=\\sum_kP^{(m)}_{ik}P^{(n)}_{kj},\\qquad P^{(n)}=P^n",explanation:"m+n 步转移可以对中间状态 k 边缘化；齐次链的 n 步矩阵就是一步矩阵的 n 次幂。",nature:"推导",
    variables:[V("P^(n)_ij","n 步从 i 到 j 的概率","多步转移"),V("k","第 m 步中间状态","对所有可能边缘化"),V("m,n","两个时间跨度","相加为总步数")],
    derivation:[D("P(S_{m+n}=j|S_0=i)=\\sum_kP(S_{m+n}=j,S_m=k|S_0=i)","对中间状态 k 用全概率。"),D("=\\sum_kP(S_{m+n}=j|S_m=k)P(S_m=k|S_0=i)","使用条件概率。"),D("=\\sum_kP^{(n)}_{kj}P^{(m)}_{ik}","齐次性和马尔可夫性去掉更早历史。"),D("P^{(m+n)}=P^{(m)}P^{(n)}\\Rightarrow P^{(n)}=P^n","识别矩阵乘法并递归。")],
    example:E("P=[[0,1],[1,0]]",["P²=I"],"两步后必回到原状态"),sources:[STD()],tags:["马尔可夫链","多步转移"],visual:"markov",
  },
  {
    id:"stationary-distribution",title:"平稳分布",category:"强化学习与马尔可夫过程",topic:"马尔可夫链",
    latex:"\\boldsymbol\\pi^T=\\boldsymbol\\pi^TP,\\qquad\\sum_i\\pi_i=1",explanation:"若状态分布为 π，走一步后仍是 π；它是 Pᵀ 特征值1的归一化非负特征向量。",nature:"定义/构造",
    variables:[V("π","平稳概率向量","分量非负且和1"),V("P","转移矩阵","对分布右乘"),V("π_i","长期处于状态 i 的比例","遍历条件下成立")],
    derivation:[D("\\mu_{t+1}^T=\\mu_t^TP","状态分布传播式。"),D("\\mu_{t+1}=\\mu_t=\\pi","要求一步后不变。"),D("\\pi^T=\\pi^TP","得到左特征向量方程。"),D("P^T\\pi=\\pi","转置后看作特征值1问题。")],
    example:E("P=[[.8,.2],[.1,.9]]",["令 π₁=.8π₁+.1π₂ ⇒ .2π₁=.1π₂","加 π₁+π₂=1"],"π=[1/3,2/3]"),sources:[ESL("14.10","14-Unsupervised-Learning/14.10-The-Google-PageRank-Algorithm.md"),STD()],tags:["平稳分布","PageRank"],visual:"markov",
  },
  {
    id:"mdp",title:"马尔可夫决策过程（MDP）",category:"强化学习与马尔可夫过程",topic:"MDP",
    latex:"\\mathcal M=(\\mathcal S,\\mathcal A,P,R,\\gamma)",explanation:"MDP 在马尔可夫状态上加入动作、奖励和折扣；策略决定动作分布，环境决定转移与奖励。",nature:"定义/构造",
    variables:[V("S","状态空间","智能体可观察的充分状态"),V("A","动作空间","可选择行为"),V("P(s'|s,a)","转移核","环境动力学"),V("R(s,a,s')","即时奖励","一步效用"),V("γ","折扣因子","0≤γ<1")],
    derivation:[D("S_{t+1}\\sim P(\\cdot|S_t,A_t)","环境按状态动作产生下一状态。"),D("R_{t+1}=R(S_t,A_t,S_{t+1})","同一步产生奖励。"),D("A_t\\sim\\pi(\\cdot|S_t)","策略闭合决策循环。"),D("(S,A,P,R,\\gamma)","五元组收集求解所需全部对象。")],
    example:E("网格世界",["S=格子位置，A=上下左右","P=移动成功/打滑概率，R=到终点+1，γ=.99"],"策略是在每格给出动作分布"),sources:[STD()],tags:["MDP","强化学习"],visual:"markov",
  },
  {
    id:"discounted-return",title:"折扣回报",category:"强化学习与马尔可夫过程",topic:"价值函数",
    latex:"G_t=R_{t+1}+\\gamma R_{t+2}+\\gamma^2R_{t+3}+\\cdots=R_{t+1}+\\gamma G_{t+1}",explanation:"把未来奖励按 γ 的幂衰减求和；递归形式是所有 Bellman 方程的起点。",nature:"推导",
    variables:[V("G_t","从 t 开始的累计回报","价值的随机目标"),V("R_{t+k}","未来第 k 步奖励","由轨迹产生"),V("γ","折扣因子","控制远期权重")],
    derivation:[D("G_t=R_{t+1}+\\gamma R_{t+2}+\\gamma^2R_{t+3}+\\cdots","写无穷折扣和。"),D("=R_{t+1}+\\gamma(R_{t+2}+\\gamma R_{t+3}+\\cdots)","提出一个 γ。"),D("=R_{t+1}+\\gamma G_{t+1}","括号内正是下一时刻回报。")],
    example:E("未来奖励恒为1，γ=.9",["G=1+.9+.9²+…","几何级数和1/(1-.9)"],"G=10"),sources:[STD()],tags:["回报","折扣"],visual:"markov",
  },
  {
    id:"bellman-v",title:"Bellman 期望方程（V）",category:"强化学习与马尔可夫过程",topic:"价值函数",
    latex:"V^\\pi(s)=\\sum_a\\pi(a|s)\\sum_{s',r}p(s',r|s,a)[r+\\gamma V^\\pi(s')]",explanation:"状态价值等于在策略下的一步期望奖励，加折扣后的下一状态价值。",nature:"推导",
    variables:[V("V^π(s)","策略 π 下状态 s 的期望回报","E[G_t|S_t=s]"),V("π(a|s)","动作概率","策略给出"),V("p(s',r|s,a)","环境联合转移奖励分布","对下一结果求期望"),V("γ","折扣","缩放未来价值")],
    derivation:[D("V^\\pi(s)=E_\\pi[G_t|S_t=s]","价值定义。"),D("=E_\\pi[R_{t+1}+\\gamma G_{t+1}|S_t=s]","代入回报递归。"),D("=E_\\pi[R_{t+1}+\\gamma V^\\pi(S_{t+1})|S_t=s]","用全期望把未来回报替为下一状态价值。"),D("=\\sum_a\\pi(a|s)\\sum_{s',r}p(s',r|s,a)[r+\\gamma V^\\pi(s')]","展开离散期望。")],
    example:E("状态 s 只有一个动作：立得1并以概率1回到 s，γ=.9",["V=1+.9V",".1V=1"],"V=10"),sources:[STD()],tags:["Bellman","状态价值"],visual:"markov",
  },
  {
    id:"bellman-q",title:"Bellman 期望方程（Q）",category:"强化学习与马尔可夫过程",topic:"价值函数",
    latex:"Q^\\pi(s,a)=\\sum_{s',r}p(s',r|s,a)\\left[r+\\gamma\\sum_{a'}\\pi(a'|s')Q^\\pi(s',a')\\right]",explanation:"动作价值固定当前动作 a，再从下一状态开始遵循策略 π。",nature:"推导",
    variables:[V("Q^π(s,a)","状态动作价值","先做 a 后的期望回报"),V("a'","下一动作","由策略在 s' 选择"),V("s',r","下一状态与即时奖励","环境随机结果"),V("γ","折扣","缩放后续 Q")],
    derivation:[D("Q^\\pi(s,a)=E[G_t|S_t=s,A_t=a]","动作价值定义。"),D("=E[R_{t+1}+\\gamma G_{t+1}|s,a]","代入回报递归。"),D("E[G_{t+1}|S_{t+1}=s']=\\sum_{a'}\\pi(a'|s')Q^\\pi(s',a')","下一状态价值是动作价值的策略平均。"),D("\\text{对 }s',r\\text{ 展开期望}","得到公式。")],
    example:E("确定转移：做 a 得2并到 s'；s' 的策略平均 Q 为5，γ=.9",["Q=2+.9·5"],"Q=6.5"),sources:[STD()],tags:["Bellman","动作价值"],visual:"markov",
  },
  {
    id:"bellman-optimality",title:"Bellman 最优方程",category:"强化学习与马尔可夫过程",topic:"最优控制",
    latex:"Q^*(s,a)=\\mathbb E[r+\\gamma\\max_{a'}Q^*(s',a')|s,a]",explanation:"当前动作后的最优价值等于即时奖励加下一状态能选择的最大动作价值。",nature:"推导",
    variables:[V("Q*","最优动作价值","所有策略中的最大期望回报"),V("a'","下一候选动作","取最大值"),V("s',r","环境下一结果","外层取期望"),V("γ","折扣","权衡未来")],
    derivation:[D("Q^*(s,a)=\\max_\\pi Q^\\pi(s,a)","最优价值定义。"),D("=E[r+\\gamma\\max_\\pi V^\\pi(s')|s,a]","一步后可重新选择最优策略。"),D("V^*(s')=\\max_{a'}Q^*(s',a')","最优状态价值等于最大动作价值。"),D("Q^*=E[r+\\gamma\\max_{a'}Q^*(s',a')]","代入得到最优方程。")],
    example:E("到 s' 后两个动作 Q*=3,7，即时奖励1，γ=.5",["目标=1+.5·max(3,7)"],"Q*(s,a)=4.5"),sources:[STD()],tags:["Bellman","最优控制"],visual:"markov",
  },
  {
    id:"advantage",title:"优势函数",category:"强化学习与马尔可夫过程",topic:"价值函数",
    latex:"A^\\pi(s,a)=Q^\\pi(s,a)-V^\\pi(s),\\qquad\\sum_a\\pi(a|s)A^\\pi(s,a)=0",explanation:"衡量动作 a 相对策略在状态 s 的平均表现有多好；作为基线中心化信号可降低策略梯度方差。",nature:"推导",
    variables:[V("Q^π","选择具体动作后的价值","动作层面"),V("V^π","按策略平均的价值","状态基线"),V("A^π","相对优势","正值优于平均"),V("π(a|s)","动作权重","用于验证均值为0")],
    derivation:[D("V^\\pi(s)=\\sum_a\\pi(a|s)Q^\\pi(s,a)","状态价值是动作价值的策略平均。"),D("\\sum_a\\pi A=\\sum_a\\pi(Q-V)","代入优势定义。"),D("=V-V\\sum_a\\pi(a|s)=V-V=0","利用动作概率和为1。")],
    example:E("π=[.5,.5]，Q=[4,8]",["V=.5·4+.5·8=6","A=[-2,2]"],"策略加权优势均值0"),sources:[STD()],tags:["优势函数","Actor-Critic"],visual:"markov",
  },
  {
    id:"policy-gradient",title:"策略梯度定理",category:"强化学习与马尔可夫过程",topic:"策略优化",
    latex:"\\nabla_\\theta J(\\theta)=\\mathbb E_{s,a\\sim\\pi_\\theta}[\\nabla_\\theta\\log\\pi_\\theta(a|s)Q^{\\pi}(s,a)]",explanation:"不需要对环境动力学求导；用 log-derivative trick 把轨迹概率梯度变成策略 log 概率梯度。",nature:"推导",
    variables:[V("θ","策略参数","被优化"),V("J","期望回报","优化目标"),V("π_θ(a|s)","可微随机策略","产生动作"),V("Q^π","动作的长期价值","给梯度加权")],
    derivation:[D("J=\\sum_\\tau p_\\theta(\\tau)R(\\tau)","把目标写成轨迹期望。"),D("\\nabla J=\\sum_\\tau p_\\theta(\\tau)\\nabla\\log p_\\theta(\\tau)R(\\tau)","使用 ∇p=p∇logp。"),D("\\log p_\\theta(\\tau)=C+\\sum_t\\log\\pi_\\theta(a_t|s_t)","环境转移与 θ 无关。"),D("\\nabla J=E[\\sum_t\\nabla\\log\\pi(a_t|s_t)G_t]","交换求和并用从该时刻起的回报；条件期望可换成 Q。")],
    example:E("某动作 log 概率梯度 [1,-1]，Q=3",["样本梯度=Q·∇logπ"],"[3,-3]"),sources:[STD()],tags:["策略梯度","RL"],visual:"optimization",
  },
  {
    id:"reinforce",title:"REINFORCE 与基线",category:"强化学习与马尔可夫过程",topic:"策略优化",
    latex:"\\hat g=\\sum_t\\nabla_\\theta\\log\\pi_\\theta(A_t|S_t)[G_t-b(S_t)]",explanation:"用蒙特卡洛回报替代未知 Q；减去只依赖状态的基线不改变期望，却可显著降低方差。",nature:"推导",
    variables:[V("G_t","完整轨迹蒙特卡洛回报","Q 的无偏样本"),V("b(S_t)","状态基线","不依赖当前动作"),V("∇logπ","score 函数","指示提高/降低动作概率"),V("ĝ","单轨迹梯度估计","对时间求和")],
    derivation:[D("E[\\nabla\\log\\pi(a|s)b(s)|s]=b(s)\\sum_a\\pi(a|s)\\nabla\\log\\pi(a|s)","把基线提出。"),D("=b(s)\\sum_a\\nabla\\pi(a|s)=b(s)\\nabla1=0","基线项期望为0。"),D("E[\\nabla\\log\\pi(G-b)]=E[\\nabla\\log\\pi G]","因此估计无偏。")],
    example:E("G=10，基线7，∇logπ=.2",["无基线贡献2","有基线贡献 .2·3"],"贡献0.6，通常方差更小"),sources:[STD()],tags:["REINFORCE","基线"],visual:"optimization",
  },
  {
    id:"td-zero",title:"TD(0) 时序差分",category:"强化学习与马尔可夫过程",topic:"价值学习",
    latex:"\\delta_t=R_{t+1}+\\gamma V(S_{t+1})-V(S_t),\\qquad V(S_t)\\leftarrow V(S_t)+\\alpha\\delta_t",explanation:"用一步奖励和下一状态当前估计作为 bootstrap 目标，无需等待回合结束。",nature:"推导",
    variables:[V("δ_t","TD 误差","一步目标减当前预测"),V("α","价值学习率","缩放修正"),V("V(S_t)","当前状态价值估计","被更新"),V("R+γV(S')","TD 目标","部分采样、部分估计")],
    derivation:[D("V^\\pi(s)=E[R+\\gamma V^\\pi(S')|s]","Bellman 方程给固定点。"),D("Y_t=R_{t+1}+\\gamma V(S_{t+1})","用一次转移构造随机目标。"),D("\\delta_t=Y_t-V(S_t)","预测误差。"),D("V\\leftarrow V+\\alpha\\delta","对平方误差做随机梯度步。")],
    example:E("V(s)=4，奖励2，V(s')=5，γ=.9，α=.1",["δ=2+.9·5-4=2.5","新V=4+.1·2.5"],"V(s)=4.25"),sources:[STD()],tags:["TD","价值学习"],visual:"markov",
  },
  {
    id:"sarsa",title:"SARSA",category:"强化学习与马尔可夫过程",topic:"价值学习",
    latex:"Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha[R_{t+1}+\\gamma Q(S_{t+1},A_{t+1})-Q(S_t,A_t)]",explanation:"使用行为策略实际选择的下一动作 Aₜ₊₁ 做目标，是 on-policy TD 控制。",nature:"推导",
    variables:[V("S_t,A_t","当前状态动作","被更新的 Q 表项"),V("S_{t+1},A_{t+1}","实际下一状态动作","按同一行为策略采样"),V("α","学习率","修正比例"),V("γ","折扣","未来 Q 权重")],
    derivation:[D("Q^\\pi(s,a)=E[R+\\gamma Q^\\pi(S',A')|s,a]","策略 Bellman 方程。"),D("Y=R+\\gamma Q(S',A')","用实际五元组 S,A,R,S',A' 构造样本目标。"),D("Q\\leftarrow Q+\\alpha(Y-Q)","执行 TD 误差更新。")],
    example:E("Q=3,R=1,Q'=5,γ=.9,α=.2",["目标=5.5，误差2.5","更新3+.2·2.5"],"新Q=3.5"),sources:[STD()],tags:["SARSA","On-policy"],visual:"markov",
  },
  {
    id:"q-learning",title:"Q-learning",category:"强化学习与马尔可夫过程",topic:"价值学习",
    latex:"Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha[R_{t+1}+\\gamma\\max_aQ(S_{t+1},a)-Q(S_t,A_t)]",explanation:"直接用下一状态的贪心最大 Q 做目标，即使行为策略在探索，也学习最优策略价值。",nature:"推导",
    variables:[V("Q(S,A)","动作价值表/网络输出","被学习"),V("max_a Q(S',a)","下一状态贪心价值","off-policy 目标"),V("α","学习率","更新幅度"),V("γ","折扣","未来权重")],
    derivation:[D("Q^*(s,a)=E[R+\\gamma\\max_{a'}Q^*(S',a')|s,a]","Bellman 最优固定点。"),D("Y_t=R_{t+1}+\\gamma\\max_{a'}Q(S_{t+1},a')","用单步样本替代期望。"),D("Q\\leftarrow Q+\\alpha(Y_t-Q)","随机逼近固定点。")],
    example:E("Q(s,a)=2,R=1，下一状态 Q=[3,5]，γ=.9，α=.1",["目标=1+.9·5=5.5","误差3.5，更新+.35"],"新Q=2.35"),sources:[STD()],tags:["Q-learning","Off-policy"],visual:"markov",
  },
  {
    id:"actor-critic",title:"Actor–Critic",category:"强化学习与马尔可夫过程",topic:"策略优化",
    latex:"\\delta_t=r_{t+1}+\\gamma V_w(s_{t+1})-V_w(s_t),\\quad\\theta\\leftarrow\\theta+\\alpha_\\theta\\delta_t\\nabla_\\theta\\log\\pi_\\theta(a_t|s_t)",explanation:"Critic 用 TD 学价值并产生低方差优势近似 δ；Actor 用它加权策略梯度。",nature:"推导",
    variables:[V("V_w","参数 w 的价值评论家","估计状态价值"),V("π_θ","参数 θ 的策略演员","选择动作"),V("δ_t","TD 误差","近似一步优势"),V("α_θ","Actor 学习率","策略更新幅度")],
    derivation:[D("A^\\pi(s,a)=E[r+\\gamma V^\\pi(s')-V^\\pi(s)|s,a]","优势可写成期望 TD 误差。"),D("\\hat A_t=\\delta_t=r+\\gamma V_w(s')-V_w(s)","用一次转移估计优势。"),D("\\nabla J\\approx\\delta_t\\nabla\\log\\pi_\\theta(a_t|s_t)","代入策略梯度定理。"),D("w\\text{ 同时最小化 }\\delta_t^2","评论家逼近 Bellman 固定点。")],
    example:E("δ=.5，∇logπ=[.2,-.1]，α=.1",["Δθ=.1·.5·[.2,-.1]"],"Δθ=[.01,-.005]"),sources:[STD()],tags:["Actor-Critic","优势"],visual:"optimization",
  },
  {
    id:"gae",title:"广义优势估计（GAE）",category:"强化学习与马尔可夫过程",topic:"策略优化",
    latex:"\\hat A_t^{GAE(\\gamma,\\lambda)}=\\sum_{l=0}^{\\infty}(\\gamma\\lambda)^l\\delta_{t+l}",explanation:"把多步 TD 误差按 γλ 指数加权；λ 在低方差的一步估计和低偏差的蒙特卡洛估计之间调节。",nature:"推导",
    variables:[V("δ_t","一步 TD 误差","r+γV'-V"),V("γ","折扣因子","任务时间尺度"),V("λ","迹衰减参数","0到1"),V("l","未来 TD 误差偏移","求和索引")],
    derivation:[D("\\hat A_t^{(1)}=\\delta_t","一步优势估计。"),D("\\hat A_t^{(k)}=\\sum_{l=0}^{k-1}\\gamma^l\\delta_{t+l}","k 步回报减基线可望远镜展开为 TD 误差和。"),D("(1-\\lambda)\\sum_{k=1}^{\\infty}\\lambda^{k-1}\\hat A_t^{(k)}","对不同步长做几何混合。"),D("=\\sum_{l=0}^{\\infty}(\\gamma\\lambda)^l\\delta_{t+l}","交换求和并化简。")],
    example:E("δ_t=1,δ_{t+1}=2，之后0，γ=.9,λ=.8",["A=1+(.9·.8)·2"],"A=2.44"),sources:[STD()],tags:["GAE","优势估计"],visual:"markov",
  },
  {
    id:"ppo",title:"PPO 裁剪目标",category:"强化学习与马尔可夫过程",topic:"策略优化",
    latex:"L^{clip}=\\mathbb E_t\\left[\\min(r_t\\hat A_t,\\operatorname{clip}(r_t,1-\\epsilon,1+\\epsilon)\\hat A_t)\\right],\\quad r_t=\\frac{\\pi_\\theta(a_t|s_t)}{\\pi_{old}(a_t|s_t)}",explanation:"概率比衡量新旧策略变化；裁剪阻止有利样本继续把策略推得过远，形成保守更新。",nature:"定义/构造",
    variables:[V("r_t","新旧动作概率比","=1 表示未变"),V("Â_t","优势估计","正值鼓励动作，负值抑制"),V("ε","裁剪半径","常取0.1–0.2"),V("π_old","采样策略","收集当前批数据")],
    derivation:[D("L^{PG}=E[r_t\\hat A_t]","重要性采样把旧策略数据用于新策略目标。"),D("\\tilde r_t=clip(r_t,1-\\epsilon,1+\\epsilon)","限制概率比的有效区间。"),D("\\min(r_t\\hat A_t,\\tilde r_t\\hat A_t)","取更悲观值；正优势限制过度增大，负优势限制过度减小。")],
    example:E("Â=2,r=1.4,ε=.2",["未裁剪项2.8","裁剪比1.2，裁剪项2.4","取较小"],"目标贡献2.4"),sources:[STD()],tags:["PPO","RLHF"],visual:"optimization",
  },
  {
    id:"entropy-bonus",title:"策略熵奖励",category:"强化学习与马尔可夫过程",topic:"探索",
    latex:"J_{ent}=J+\\beta\\mathbb E_s[H(\\pi(\\cdot|s))],\\qquad H(\\pi)=-\\sum_a\\pi(a|s)\\log\\pi(a|s)",explanation:"在回报目标上奖励高熵策略，避免过早塌缩到单一动作并促进探索。",nature:"定义/构造",
    variables:[V("J","原始期望回报","利用项"),V("β","熵系数","探索强度"),V("π(a|s)","动作概率","熵的输入"),V("H","策略不确定性","均匀策略最大")],
    derivation:[D("H(\\pi)=-\\sum_a\\pi_a\\log\\pi_a","定义每个状态的动作熵。"),D("J_{ent}=J+\\beta E[H]","把探索偏好作为正则项加入最大化目标。"),D("\\beta>0\\Rightarrow\\text{低熵确定策略受相对惩罚}","均匀分布比尖锐分布有更大加成。")],
    example:E("两动作策略 [.5,.5] 与 [1,0]，使用自然对数",["均匀熵=log2≈.693","确定策略熵=0"],"β=.01 时均匀策略多得约.00693目标值"),sources:[STD()],tags:["探索","熵","强化学习"],visual:"distribution",
  },
];

export const formulas: FormulaEntry[] = [...foundationFormulas, ...classicMlFormulas, ...deepLearningFormulas, ...llmFormulas, ...rlFormulas];

export const formulaById = new Map(formulas.map((formula) => [formula.id, formula]));

export const sourceCoverage = [
  { source: "课程 PPT", detail: "16 页已逐页检查；第 4–15 页所有数学主题均映射到公式条目。" },
  { source: "ESL-CN", detail: "按 18 章目录建立覆盖矩阵；经典统计学习条目链接到对应章节。" },
  { source: "扩展专题", detail: "补充高数、现代深度学习、Transformer、MoE、训练推理、强化学习与马尔可夫过程。" },
];
