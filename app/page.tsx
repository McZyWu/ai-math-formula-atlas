"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MathFormula } from "../components/MathFormula";
import { VisualLab } from "../components/VisualLab";
import {
  categories,
  formulas,
  sourceCoverage,
  type FormulaCategory,
  type FormulaEntry,
} from "../lib/formulas";

function DerivationStepper({ formula }: { formula: FormulaEntry }) {
  const [step, setStep] = useState(0);

  return (
    <section className="detail-section derivation-section" aria-labelledby="derivation-title">
      <div className="section-heading">
        <div><span className="eyebrow">STEP-BY-STEP</span><h2 id="derivation-title">{formula.nature === "定义/构造" ? "构造与推演过程" : "完整推导过程"}</h2></div>
        <div className="step-actions" aria-label="推导步骤控制">
          <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>上一步</button>
          <span>{step + 1} / {formula.derivation.length}</span>
          <button type="button" onClick={() => setStep((value) => Math.min(formula.derivation.length - 1, value + 1))} disabled={step === formula.derivation.length - 1}>下一步</button>
        </div>
      </div>
      {formula.nature === "定义/构造" && <p className="definition-note">这是定义或算法构造，不做循环“证明”；下面展示它从动机、约束到最终形式的构造链。</p>}
      <ol className="derivation-list">
        {formula.derivation.map((item, index) => (
          <li key={`${formula.id}-${index}`} className={index === step ? "derivation-item derivation-item--active" : "derivation-item"}>
            <button type="button" onClick={() => setStep(index)} aria-current={index === step ? "step" : undefined}>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="step-body"><MathFormula latex={item.formula} display /><small>{item.note}</small></span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FormulaDetail({ formula }: { formula: FormulaEntry }) {
  const [copied, setCopied] = useState(false);

  async function copyFormula() {
    try {
      await navigator.clipboard.writeText(formula.latex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="formula-detail">
      <header className="formula-hero">
        <div className="breadcrumb"><span>{formula.category}</span><i>→</i><span>{formula.topic}</span></div>
        <div className="formula-title-row">
          <div><p className="formula-index">FORMULA · {formula.id.toUpperCase()}</p><h1>{formula.title}</h1></div>
          <button type="button" className="copy-button" onClick={copyFormula}>{copied ? "已复制 LaTeX" : "复制 LaTeX"}</button>
        </div>
        <div className="hero-equation"><MathFormula latex={formula.latex} display /></div>
        <p className="lead">{formula.explanation}</p>
        <div className="tag-row">{formula.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </header>

      <section className="detail-section" aria-labelledby="variables-title">
        <div className="section-heading"><div><span className="eyebrow">SYMBOLS</span><h2 id="variables-title">每个变量是什么意思、怎么参与运算</h2></div></div>
        <div className="variable-table-wrap">
          <table className="variable-table">
            <thead><tr><th>符号</th><th>含义</th><th>运算角色</th></tr></thead>
            <tbody>{formula.variables.map((item) => <tr key={`${formula.id}-${item.symbol}`}><td><MathFormula latex={item.symbol} /></td><td>{item.meaning}</td><td>{item.operation}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <DerivationStepper key={formula.id} formula={formula} />

      <section className="detail-section" aria-labelledby="lab-title">
        <div className="section-heading"><div><span className="eyebrow">INTERACTIVE LAB</span><h2 id="lab-title">运算过程可视化</h2></div><p>拖动参数，观察公式结构如何改变结果。</p></div>
        <div className="visual-lab"><VisualLab formula={formula} /></div>
      </section>

      <section className="detail-section example-section" aria-labelledby="example-title">
        <div className="section-heading"><div><span className="eyebrow">WORKED EXAMPLE</span><h2 id="example-title">从数字到答案的完整算例</h2></div></div>
        <div className="example-grid">
          <div><span>已知</span><p>{formula.example.setup}</p></div>
          <div className="example-work"><span>逐步运算</span><ol>{formula.example.work.map((item, index) => <li key={index}><b>{index + 1}</b><p>{item}</p></li>)}</ol></div>
          <div className="example-answer"><span>结论</span><p>{formula.example.answer}</p></div>
        </div>
      </section>

      <footer className="formula-sources">
        <span>条目来源</span>
        {formula.sources.map((source, index) => <a key={`${source.label}-${index}`} href={source.href} target={source.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{source.label}</a>)}
      </footer>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FormulaCategory | "全部">("全部");
  const [onlyPpt, setOnlyPpt] = useState(false);
  const [selectedId, setSelectedId] = useState(formulas[0].id);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash && formulas.some((formula) => formula.id === hash)) setSelectedId(hash);
    };
    queueMicrotask(syncHash);
    const shortcut = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("keydown", shortcut);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("keydown", shortcut);
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return formulas.filter((formula) => {
      if (category !== "全部" && formula.category !== category) return false;
      if (onlyPpt && !formula.tags.includes("PPT必含")) return false;
      if (!needle) return true;
      return [formula.title, formula.topic, formula.category, formula.explanation, ...formula.tags, ...formula.variables.map((item) => `${item.symbol} ${item.meaning}`)].join(" ").toLowerCase().includes(needle);
    });
  }, [category, onlyPpt, query]);

  const selected = filtered.find((formula) => formula.id === selectedId) ?? filtered[0] ?? formulas.find((formula) => formula.id === selectedId) ?? formulas[0];
  const grouped = useMemo(() => categories.map((name) => ({ name, items: filtered.filter((formula) => formula.category === name) })).filter((group) => group.items.length), [filtered]);
  const pptCount = formulas.filter((formula) => formula.tags.includes("PPT必含")).length;

  function chooseFormula(id: string) {
    setSelectedId(id);
    setCatalogOpen(false);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页"><span>∑</span><div><b>AI 数学公式图谱</b><small>DERIVE · COMPUTE · VISUALIZE</small></div></a>
        <div className="search-shell"><span>⌕</span><input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索公式、变量、算法…" aria-label="搜索公式" /><kbd>/</kbd></div>
        <a className="github-link" href="https://github.com/McZyWu" target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>

      <section className="overview" id="top">
        <div className="overview-copy"><p className="kicker">FROM CALCULUS TO FOUNDATION MODELS</p><h1>每一条公式，<br /><em>都能走完推导。</em></h1><p>覆盖高数、线代、概率统计、ESL 经典机器学习、神经网络、Transformer、MoE、训练推理、强化学习与马尔可夫过程。公式不是墙上的结论，而是可拆解、可计算、可操控的过程。</p></div>
        <div className="overview-stats">
          <div><strong>{formulas.length}</strong><span>独立公式条目</span></div>
          <div><strong>{categories.length}</strong><span>知识主干</span></div>
          <div><strong>{pptCount}</strong><span>PPT 必含条目</span></div>
          <div><strong>18/18</strong><span>ESL-CN 章节覆盖</span></div>
        </div>
      </section>

      <nav className="category-strip" aria-label="知识分类">
        <button type="button" className={category === "全部" ? "is-active" : ""} onClick={() => setCategory("全部")}>全部 · {formulas.length}</button>
        {categories.map((name) => <button type="button" className={category === name ? "is-active" : ""} key={name} onClick={() => setCategory(name)}>{name} · {formulas.filter((item) => item.category === name).length}</button>)}
      </nav>

      <div className="catalog-toolbar">
        <button type="button" className="catalog-toggle" aria-expanded={catalogOpen} onClick={() => setCatalogOpen((value) => !value)}>目录 {catalogOpen ? "收起" : "展开"} · {filtered.length} 条</button>
        <label className="ppt-switch"><input type="checkbox" checked={onlyPpt} onChange={(e) => setOnlyPpt(e.target.checked)} /><span>只看 PPT 必含</span></label>
        {(query || category !== "全部" || onlyPpt) && <button type="button" className="reset-filter" onClick={() => { setQuery(""); setCategory("全部"); setOnlyPpt(false); }}>清除筛选</button>}
      </div>

      <div className="workspace">
        <aside className={catalogOpen ? "catalog catalog--open" : "catalog"} aria-label="公式目录">
          <div className="catalog-meta"><span>FORMULA INDEX</span><b>{filtered.length} / {formulas.length}</b></div>
          {filtered.length === 0 && <p className="empty-state">没有匹配公式。换个关键词，或清除筛选。</p>}
          {grouped.map((group) => <section key={group.name}><h2>{group.name}<span>{group.items.length}</span></h2>{group.items.map((formula) => <button type="button" key={formula.id} className={selected.id === formula.id ? "formula-nav formula-nav--active" : "formula-nav"} onClick={() => chooseFormula(formula.id)}><span>{formula.topic}</span><b>{formula.title}</b><small>{formula.nature}</small></button>)}</section>)}
          <div className="coverage-ledger" id="sources"><span>SOURCE LEDGER</span>{sourceCoverage.map((item) => <div key={item.source}><b>{item.source}</b><p>{item.detail}</p></div>)}</div>
        </aside>
        <FormulaDetail key={selected.id} formula={selected} />
      </div>

      <section className="coverage-section">
        <div><p className="kicker">COVERAGE PROMISE</p><h2>资料不是“参考过”，而是可以逐条追溯。</h2></div>
        <div className="coverage-grid">{sourceCoverage.map((item, index) => <article key={item.source}><span>0{index + 1}</span><h3>{item.source}</h3><p>{item.detail}</p></article>)}</div>
      </section>

      <footer className="site-footer"><p>AI 数学公式图谱 · 面向机器学习与大模型的推导式数学手册</p><p>公式采用 LaTeX；定义类条目展示构造链，定理与算法展示推导链。</p></footer>
    </main>
  );
}
