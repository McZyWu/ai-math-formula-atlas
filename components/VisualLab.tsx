"use client";

import { useMemo, useState } from "react";
import type { FormulaEntry } from "../lib/formulas";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function pointsToPath(points: [number, number][]) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

function PlotFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg className="lab-plot" viewBox="0 0 640 260" role="img" aria-label={label}>
      <line className="lab-grid" x1="40" x2="620" y1="130" y2="130" />
      <line className="lab-grid" x1="330" x2="330" y1="18" y2="242" />
      {children}
    </svg>
  );
}

function CurveLab({ formula }: { formula: FormulaEntry }) {
  const [a, setA] = useState(1);
  const [x0, setX0] = useState(1);
  const isActivation = formula.visual === "activation";

  const fn = (x: number) => {
    if (formula.id === "sigmoid" || formula.id === "logistic-regression") return 1 / (1 + Math.exp(-a * x));
    if (formula.id === "tanh") return Math.tanh(a * x);
    if (formula.id === "relu") return Math.max(0, a * x);
    if (formula.id === "gelu") return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));
    if (formula.id === "silu") return x / (1 + Math.exp(-a * x));
    return a * x * x;
  };

  const scaleX = (x: number) => 330 + x * 52;
  const scaleY = (y: number) => 130 - y * (isActivation ? 72 : 16);
  const samples = Array.from({ length: 121 }, (_, i) => -5.5 + (11 * i) / 120);
  const curve = pointsToPath(samples.map((x) => [scaleX(x), clamp(scaleY(fn(x)), 18, 242)]));
  const y0 = fn(x0);
  const h = 0.001;
  const slope = (fn(x0 + h) - fn(x0 - h)) / (2 * h);
  const tangent = pointsToPath([-2.4, 2.4].map((dx) => [scaleX(x0 + dx), clamp(scaleY(y0 + slope * dx), 18, 242)]));

  return (
    <div className="lab-content">
      <div className="lab-controls">
        <label>形状参数 a <output>{a.toFixed(1)}</output><input type="range" min="-2" max="2" step="0.1" value={a} onChange={(e) => setA(Number(e.target.value))} /></label>
        <label>观察位置 x₀ <output>{x0.toFixed(1)}</output><input type="range" min="-3" max="3" step="0.1" value={x0} onChange={(e) => setX0(Number(e.target.value))} /></label>
      </div>
      <PlotFrame label={`${formula.title} 函数曲线及局部切线`}>
        <path className="lab-line" d={curve} />
        <path className="lab-line lab-line--secondary" d={tangent} />
        <circle className="lab-point" cx={scaleX(x0)} cy={clamp(scaleY(y0), 18, 242)} r="5" />
        <text className="lab-label" x="48" y="36">曲线</text>
        <text className="lab-label lab-label--secondary" x="48" y="55">切线斜率 ≈ {slope.toFixed(3)}</text>
      </PlotFrame>
    </div>
  );
}

function MatrixLab() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(-1);
  const [d, setD] = useState(2);
  const [x, setX] = useState(1);
  const [y, setY] = useState(2);
  const outX = a * x + b * y;
  const outY = c * x + d * y;
  const control = (label: string, value: number, setter: (n: number) => void) => (
    <label>{label} <output>{value}</output><input type="range" min="-3" max="3" step="1" value={value} onChange={(e) => setter(Number(e.target.value))} /></label>
  );
  return (
    <div className="lab-content lab-content--split">
      <div className="lab-controls lab-controls--matrix">
        {control("a₁₁", a, setA)}{control("a₁₂", b, setB)}{control("a₂₁", c, setC)}{control("a₂₂", d, setD)}
        {control("x₁", x, setX)}{control("x₂", y, setY)}
      </div>
      <div className="matrix-equation" aria-label={`矩阵乘向量结果为 ${outX}, ${outY}`}>
        <div className="matrix-grid"><span>{a}</span><span>{b}</span><span>{c}</span><span>{d}</span></div>
        <span>×</span>
        <div className="matrix-grid matrix-grid--vector"><span>{x}</span><span>{y}</span></div>
        <span>=</span>
        <div className="matrix-grid matrix-grid--vector matrix-grid--result"><span>{outX}</span><span>{outY}</span></div>
      </div>
    </div>
  );
}

function DistributionLab() {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const scaleX = (x: number) => 330 + x * 55;
  const scaleY = (y: number) => 224 - y * 380;
  const samples = Array.from({ length: 151 }, (_, i) => -5.2 + (10.4 * i) / 150);
  const density = (x: number) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (Math.sqrt(2 * Math.PI) * sigma);
  const path = pointsToPath(samples.map((x) => [scaleX(x), scaleY(density(x))]));
  return (
    <div className="lab-content">
      <div className="lab-controls">
        <label>均值 μ <output>{mu.toFixed(1)}</output><input type="range" min="-2.5" max="2.5" step="0.1" value={mu} onChange={(e) => setMu(Number(e.target.value))} /></label>
        <label>标准差 σ <output>{sigma.toFixed(1)}</output><input type="range" min="0.5" max="2" step="0.1" value={sigma} onChange={(e) => setSigma(Number(e.target.value))} /></label>
      </div>
      <PlotFrame label="可调均值和标准差的高斯密度曲线">
        <path className="lab-area" d={`${path} L${scaleX(5.2)},224 L${scaleX(-5.2)},224 Z`} />
        <path className="lab-line" d={path} />
        <line className="lab-guide" x1={scaleX(mu)} x2={scaleX(mu)} y1="28" y2="224" />
        <text className="lab-label" x={clamp(scaleX(mu) + 8, 48, 570)} y="42">μ={mu.toFixed(1)}</text>
      </PlotFrame>
    </div>
  );
}

function RegressionLab() {
  const [slope, setSlope] = useState(1);
  const [bias, setBias] = useState(0);
  const data = [[-2, -1.2], [-1, -0.4], [0, 0.6], [1, 1.4], [2, 2.7]];
  const sx = (x: number) => 330 + x * 90;
  const sy = (y: number) => 130 - y * 38;
  const mse = data.reduce((sum, [x, y]) => sum + (y - (slope * x + bias)) ** 2, 0) / data.length;
  return (
    <div className="lab-content">
      <div className="lab-controls">
        <label>斜率 w <output>{slope.toFixed(1)}</output><input type="range" min="-1" max="2.5" step="0.1" value={slope} onChange={(e) => setSlope(Number(e.target.value))} /></label>
        <label>截距 b <output>{bias.toFixed(1)}</output><input type="range" min="-2" max="2" step="0.1" value={bias} onChange={(e) => setBias(Number(e.target.value))} /></label>
      </div>
      <PlotFrame label={`线性模型拟合，当前均方误差 ${mse.toFixed(3)}`}>
        <line className="lab-line" x1={sx(-3)} y1={sy(-3 * slope + bias)} x2={sx(3)} y2={sy(3 * slope + bias)} />
        {data.map(([x, y], i) => <circle className="lab-point" key={i} cx={sx(x)} cy={sy(y)} r="6" />)}
        <text className="lab-label" x="48" y="36">MSE = {mse.toFixed(3)}</text>
      </PlotFrame>
    </div>
  );
}

function AttentionLab() {
  const [s1, setS1] = useState(1.2);
  const [s2, setS2] = useState(0.2);
  const [s3, setS3] = useState(-0.5);
  const [temperature, setTemperature] = useState(1);
  const scores = [s1, s2, s3];
  const max = Math.max(...scores);
  const exp = scores.map((s) => Math.exp((s - max) / temperature));
  const total = exp.reduce((a, b) => a + b, 0);
  const probs = exp.map((v) => v / total);
  const values = [2, 6, -1];
  const output = probs.reduce((sum, p, i) => sum + p * values[i], 0);
  return (
    <div className="lab-content lab-content--split">
      <div className="lab-controls">
        {[s1, s2, s3].map((value, i) => {
          const setters = [setS1, setS2, setS3];
          return <label key={i}>分数 s{i + 1} <output>{value.toFixed(1)}</output><input type="range" min="-2" max="2" step="0.1" value={value} onChange={(e) => setters[i](Number(e.target.value))} /></label>;
        })}
        <label>温度 T <output>{temperature.toFixed(1)}</output><input type="range" min="0.3" max="2" step="0.1" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} /></label>
      </div>
      <div className="weight-stack">
        {probs.map((p, i) => <div className="weight-row" key={i}><span>token {i + 1} · v={values[i]}</span><div><i style={{ width: `${p * 100}%` }} /></div><strong>{(p * 100).toFixed(1)}%</strong></div>)}
        <p>加权输出 <strong>{output.toFixed(3)}</strong></p>
      </div>
    </div>
  );
}

function MoeLab() {
  const [focus, setFocus] = useState(1.3);
  const logits = [focus, 0.9, 0.15, -0.35];
  const exp = logits.map((v) => Math.exp(v));
  const total = exp.reduce((a, b) => a + b, 0);
  const probs = exp.map((v) => v / total);
  const chosen = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p).slice(0, 2);
  const chosenTotal = chosen.reduce((sum, item) => sum + item.p, 0);
  return (
    <div className="lab-content">
      <div className="lab-controls"><label>专家1路由 logit <output>{focus.toFixed(1)}</output><input type="range" min="-1" max="3" step="0.1" value={focus} onChange={(e) => setFocus(Number(e.target.value))} /></label></div>
      <div className="moe-flow">
        <div className="token-node">token x</div><span>router → top-2</span>
        <div className="expert-row">
          {probs.map((p, i) => {
            const selected = chosen.some((item) => item.i === i);
            const normalized = selected ? p / chosenTotal : 0;
            return <div key={i} className={selected ? "expert expert--active" : "expert"}><b>E{i + 1}</b><span>p={(p * 100).toFixed(1)}%</span><small>{selected ? `聚合权重 ${(normalized * 100).toFixed(1)}%` : "本 token 不执行"}</small></div>;
          })}
        </div>
      </div>
    </div>
  );
}

function MarkovLab() {
  const [p01, setP01] = useState(0.2);
  const [p10, setP10] = useState(0.1);
  const [steps, setSteps] = useState(5);
  const dist = useMemo(() => {
    let current = [1, 0];
    const path = [current];
    for (let i = 0; i < steps; i += 1) {
      current = [current[0] * (1 - p01) + current[1] * p10, current[0] * p01 + current[1] * (1 - p10)];
      path.push(current);
    }
    return path;
  }, [p01, p10, steps]);
  const last = dist[dist.length - 1];
  return (
    <div className="lab-content lab-content--split">
      <div className="lab-controls">
        <label>P(0→1) <output>{p01.toFixed(2)}</output><input type="range" min="0.05" max="0.9" step="0.05" value={p01} onChange={(e) => setP01(Number(e.target.value))} /></label>
        <label>P(1→0) <output>{p10.toFixed(2)}</output><input type="range" min="0.05" max="0.9" step="0.05" value={p10} onChange={(e) => setP10(Number(e.target.value))} /></label>
        <label>传播步数 <output>{steps}</output><input type="range" min="1" max="20" step="1" value={steps} onChange={(e) => setSteps(Number(e.target.value))} /></label>
      </div>
      <div className="markov-view">
        <div className="state-row"><div className="state-node">S₀</div><span>⇄</span><div className="state-node">S₁</div></div>
        <div className="prob-bar"><i style={{ width: `${last[0] * 100}%` }} /><b style={{ width: `${last[1] * 100}%` }} /></div>
        <p>第 {steps} 步：P(S₀)={last[0].toFixed(3)} · P(S₁)={last[1].toFixed(3)}</p>
      </div>
    </div>
  );
}

function OptimizationLab() {
  const [eta, setEta] = useState(0.15);
  const [start, setStart] = useState(-4);
  const target = 2;
  const points = [start];
  let x = start;
  for (let i = 0; i < 8; i += 1) {
    x -= eta * 2 * (x - target);
    points.push(x);
  }
  const sx = (v: number) => 330 + v * 48;
  const sy = (v: number) => 222 - ((v - target) ** 2) * 6;
  const curve = pointsToPath(Array.from({ length: 121 }, (_, i) => -5.7 + (11.4 * i) / 120).map((v) => [sx(v), clamp(sy(v), 20, 230)]));
  return (
    <div className="lab-content">
      <div className="lab-controls">
        <label>学习率 η <output>{eta.toFixed(2)}</output><input type="range" min="0.03" max="0.9" step="0.03" value={eta} onChange={(e) => setEta(Number(e.target.value))} /></label>
        <label>起点 θ₀ <output>{start.toFixed(1)}</output><input type="range" min="-4" max="5" step="0.5" value={start} onChange={(e) => setStart(Number(e.target.value))} /></label>
      </div>
      <PlotFrame label="二次损失上的梯度下降轨迹">
        <path className="lab-line" d={curve} />
        {points.map((value, i) => <circle className={i === points.length - 1 ? "lab-point lab-point--final" : "lab-point"} key={i} cx={sx(value)} cy={clamp(sy(value), 20, 230)} r={i === 0 || i === points.length - 1 ? 6 : 4} />)}
        <text className="lab-label" x="48" y="36">L(θ)=(θ−2)² · 8 步后 θ={points[points.length - 1].toFixed(3)}</text>
      </PlotFrame>
    </div>
  );
}

function GenericLab({ formula }: { formula: FormulaEntry }) {
  const [active, setActive] = useState(0);
  const nodes = ["输入变量", ...formula.derivation.map((_, i) => `推导 ${i + 1}`), "数值结论"];
  return (
    <div className="process-map" aria-label={`${formula.title} 运算流程`}>
      <div className="process-track">
        {nodes.map((node, i) => <button type="button" key={node} className={active === i ? "process-node process-node--active" : "process-node"} onClick={() => setActive(i)}><span>{String(i + 1).padStart(2, "0")}</span>{node}</button>)}
      </div>
      <p>{active === 0 ? `读取 ${formula.variables.map((item) => item.symbol).join("、")}，确认维度与取值条件。` : active === nodes.length - 1 ? formula.example.answer : formula.derivation[active - 1].note}</p>
    </div>
  );
}

export function VisualLab({ formula }: { formula: FormulaEntry }) {
  if (formula.visual === "matrix") return <MatrixLab />;
  if (formula.visual === "distribution") return <DistributionLab />;
  if (formula.visual === "regression") return <RegressionLab />;
  if (formula.visual === "activation" || formula.visual === "curve") return <CurveLab formula={formula} />;
  if (formula.visual === "attention") return <AttentionLab />;
  if (formula.visual === "moe") return <MoeLab />;
  if (formula.visual === "markov") return <MarkovLab />;
  if (formula.visual === "optimization") return <OptimizationLab />;
  return <GenericLab formula={formula} />;
}
