import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/* 스타일                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');

.tk {
  --ink:      #11151b;
  --panel:    #171d25;
  --panel-2:  #1d242e;
  --line:     #29323d;
  --line-2:   #364251;
  --text:     #e6eaef;
  --dim:      #8d98a7;
  --dimmer:   #5f6b7a;
  --up:       #3fbf7f;
  --down:     #e0605f;
  --wait:     #d6a44c;
  --key:      #6478ff;

  font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
               'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  background: var(--ink);
  color: var(--text);
  min-height: 100vh;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.tk * { box-sizing: border-box; }
.tk .num { font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }

.tk-wrap { max-width: 1180px; margin: 0 auto; padding: 0 20px 72px; }

/* 헤더 */
.tk-top {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 20px 0 24px;
}
.tk-brand { display: flex; align-items: baseline; gap: 10px; }
.tk-brand b { font-size: 19px; font-weight: 700; letter-spacing: -0.03em; }
.tk-brand span { font-size: 12px; color: var(--dimmer); }
.tk-tools { display: flex; gap: 6px; }

/* 버튼 공통 */
.tk button { font: inherit; cursor: pointer; border-radius: 7px; transition: background .12s, border-color .12s, color .12s; }
.tk button:focus-visible { outline: 2px solid var(--key); outline-offset: 2px; }
.tk-ghost {
  background: transparent; border: 1px solid var(--line);
  color: var(--dim); padding: 6px 11px; font-size: 12.5px;
}
.tk-ghost:hover { border-color: var(--line-2); color: var(--text); }

/* 기간 선택 */
.tk-range { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 18px; }
.tk-seg { display: flex; background: var(--panel); border: 1px solid var(--line); border-radius: 9px; padding: 3px; }
.tk-seg button {
  border: 0; background: transparent; color: var(--dim);
  padding: 6px 14px; font-size: 13px; border-radius: 6px; font-weight: 500;
}
.tk-seg button[data-on="1"] { background: var(--panel-2); color: var(--text); box-shadow: inset 0 0 0 1px var(--line-2); }
.tk-date {
  background: var(--panel); border: 1px solid var(--line); color: var(--text);
  border-radius: 8px; padding: 7px 10px; font: inherit; font-size: 13px;
  color-scheme: dark;
}
.tk-date:focus { outline: none; border-color: var(--key); }

/* 히어로 */
.tk-hero {
  display: grid; grid-template-columns: minmax(260px, 340px) 1fr; gap: 28px;
  align-items: center;
  background: var(--panel); border: 1px solid var(--line);
  border-radius: 14px; padding: 24px 26px; margin-bottom: 22px;
}
.tk-total { font-size: 44px; font-weight: 700; letter-spacing: -0.045em; line-height: 1.05; }
.tk-total small { font-size: 20px; font-weight: 600; margin-left: 3px; }
.tk-total-label { font-size: 12.5px; color: var(--dimmer); margin-bottom: 6px; }
.tk-meta { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 14px; font-size: 13px; color: var(--dim); }
.tk-meta b { color: var(--text); font-weight: 600; }
.tk-chart { height: 132px; min-width: 0; }
.tk-empty-chart {
  height: 132px; display: flex; align-items: center; justify-content: center;
  color: var(--dimmer); font-size: 13px;
  border: 1px dashed var(--line); border-radius: 10px;
}

/* 본문 그리드 */
.tk-grid { display: grid; grid-template-columns: 352px 1fr; gap: 22px; align-items: start; }
.tk-card { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; }
.tk-card + .tk-card { margin-top: 22px; }
.tk-card-h {
  display: flex; align-items: center; justify-content: space-between;
  padding: 15px 18px; border-bottom: 1px solid var(--line);
}
.tk-card-h h2 { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -0.02em; }
.tk-card-h em { font-style: normal; font-size: 12px; color: var(--dimmer); }
.tk-card-b { padding: 16px 18px; }

/* 입력폼 */
.tk-f { display: block; margin-bottom: 13px; }
.tk-f > span { display: block; font-size: 12px; color: var(--dim); margin-bottom: 6px; }
.tk-in {
  width: 100%; background: var(--panel-2); border: 1px solid var(--line);
  color: var(--text); border-radius: 8px; padding: 9px 11px; font: inherit; font-size: 14px;
  color-scheme: dark;
}
.tk-in:focus { outline: none; border-color: var(--key); }
.tk-in::placeholder { color: var(--dimmer); }
.tk-two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tk-chips { display: flex; flex-wrap: wrap; gap: 5px; }
.tk-chip {
  border: 1px solid var(--line); background: transparent; color: var(--dim);
  padding: 5px 10px; font-size: 12.5px; border-radius: 20px;
}
.tk-chip:hover { border-color: var(--line-2); }
.tk-quick { display: flex; gap: 5px; margin-top: 7px; }
.tk-quick button { flex: 1; border: 1px solid var(--line); background: transparent; color: var(--dim); font-size: 12px; padding: 5px 0; }
.tk-quick button:hover { color: var(--text); border-color: var(--line-2); }
.tk-calc { font-size: 12px; color: var(--dimmer); margin-top: 6px; min-height: 17px; }
.tk-status { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.tk-status button { border: 1px solid var(--line); background: transparent; color: var(--dim); padding: 8px 0; font-size: 13px; font-weight: 500; }
.tk-status button[data-on="1"] { color: #fff; }
.tk-submit {
  width: 100%; border: 0; background: var(--key); color: #fff;
  padding: 11px 0; font-size: 14px; font-weight: 600; margin-top: 4px;
}
.tk-submit:hover { background: #7386ff; }
.tk-cancel { width: 100%; border: 0; background: transparent; color: var(--dim); padding: 8px 0; font-size: 12.5px; margin-top: 4px; }

/* 종목별 */
.tk-cat { padding: 11px 18px; border-bottom: 1px solid var(--line); }
.tk-cat:last-child { border-bottom: 0; }
.tk-cat-r { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.tk-cat-n { font-size: 13.5px; font-weight: 600; }
.tk-cat-s { font-size: 12px; color: var(--dimmer); margin-top: 3px; }
.tk-bar { height: 3px; background: var(--line); border-radius: 2px; margin-top: 8px; overflow: hidden; }
.tk-bar i { display: block; height: 100%; border-radius: 2px; }

/* 목록 */
.tk-day { padding: 9px 18px; background: var(--panel-2); border-bottom: 1px solid var(--line); border-top: 1px solid var(--line); display: flex; justify-content: space-between; font-size: 12.5px; }
.tk-day span { color: var(--dim); }
.tk-row {
  display: grid; grid-template-columns: 68px 1fr 92px 92px 104px 62px;
  align-items: center; gap: 10px; padding: 11px 18px;
  border-bottom: 1px solid var(--line); font-size: 13.5px;
}
.tk-row:last-child { border-bottom: 0; }
.tk-row:hover { background: rgba(255,255,255,.018); }
.tk-tag { display: inline-block; font-size: 11.5px; font-weight: 600; padding: 3px 8px; border-radius: 5px; white-space: nowrap; }
.tk-memo { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tk-memo i { font-style: normal; color: var(--dimmer); font-size: 12px; margin-left: 7px; }
.tk-r { text-align: right; }
.tk-sub { color: var(--dim); }
.tk-act { display: flex; gap: 4px; justify-content: flex-end; opacity: 0; }
.tk-row:hover .tk-act, .tk-row:focus-within .tk-act { opacity: 1; }
.tk-icon { border: 0; background: transparent; color: var(--dimmer); padding: 4px; line-height: 0; border-radius: 5px; }
.tk-icon:hover { color: var(--text); background: var(--panel-2); }
.tk-settle { display: flex; gap: 5px; justify-content: flex-end; }
.tk-settle button { border: 1px solid var(--line); background: transparent; padding: 4px 9px; font-size: 12px; }
.tk-settle button:first-child { color: var(--up); }
.tk-settle button:last-child { color: var(--down); }
.tk-settle button:hover { border-color: currentColor; }

.tk-blank { padding: 56px 20px; text-align: center; color: var(--dimmer); font-size: 13.5px; line-height: 1.8; }

.tk-tip {
  background: var(--panel); border: 1px solid var(--line-2);
  border-radius: 9px; padding: 10px 12px; font-size: 12.5px; color: var(--text);
}
.tk-tip p { margin: 0; }
.tk-tip small { color: var(--dim); }

@media (max-width: 980px) {
  .tk-grid { grid-template-columns: 1fr; }
  .tk-hero { grid-template-columns: 1fr; gap: 16px; }
}
@media (max-width: 620px) {
  .tk-wrap { padding: 0 12px 60px; }
  .tk-row { grid-template-columns: 58px 1fr 96px; grid-template-areas: "tag memo profit" "tag sub sub"; row-gap: 4px; }
  .tk-hide-sm { display: none; }
  .tk-total { font-size: 36px; }
}
@media (prefers-reduced-motion: reduce) {
  .tk *, .tk *::before { transition: none !important; animation: none !important; }
}
`;

/* ------------------------------------------------------------------ */
/* 상수 · 유틸                                                          */
/* ------------------------------------------------------------------ */

const KEY = "tokyebu:v1";

const BASE_CATS = ["LOL", "축구", "야구", "농구", "배구", "UFC", "기타"];

const CAT_COLOR = {
  LOL: "#8f7ced",
  축구: "#4fb58a",
  야구: "#5aa9e0",
  농구: "#e0a74f",
  배구: "#d96a8e",
  UFC: "#e0805a",
  MLB: "#5aa9e0",
  NBA: "#e0a74f",
  기타: "#8d98a7",
};
const catColor = (c) => CAT_COLOR[c] || "#7d8b9c";
const tint = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const iso = (d) => d.toLocaleDateString("sv-SE");
const today = () => iso(new Date());
const won = (n) => (n || 0).toLocaleString("ko-KR");
const signed = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + won(Math.abs(n));
const pnlColor = (n) => (n > 0 ? "var(--up)" : n < 0 ? "var(--down)" : "var(--dim)");
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const profitOf = (b) =>
  b.status === "hit" ? (b.payout || 0) - b.stake : b.status === "miss" ? -b.stake : 0;

function monthRange(offset = 0) {
  const n = new Date();
  const s = new Date(n.getFullYear(), n.getMonth() + offset, 1);
  const e = new Date(n.getFullYear(), n.getMonth() + offset + 1, 0);
  return [iso(s), iso(e)];
}

/* ------------------------------------------------------------------ */

export default function Tokyebu() {
  const [bets, setBets] = useState([]);
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState("month");
  const [from, setFrom] = useState(monthRange()[0]);
  const [to, setTo] = useState(monthRange()[1]);

  /* 폼 상태 */
  const [editId, setEditId] = useState(null);
  const [date, setDate] = useState(today());
  const [cat, setCat] = useState("LOL");
  const [memo, setMemo] = useState("");
  const [stake, setStake] = useState("");
  const [odds, setOdds] = useState("");
  const [payout, setPayout] = useState("");
  const [status, setStatus] = useState("pending");
  const memoRef = useRef(null);
  const fileRef = useRef(null);

  /* --- 저장소 --- */
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(KEY);
        if (r && r.value) setBets(JSON.parse(r.value));
      } catch (e) {
        /* 첫 실행이면 값이 없는 게 정상 */
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      window.storage.set(KEY, JSON.stringify(bets)).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [bets, ready]);

  /* --- 기간 --- */
  const applyPreset = (p) => {
    setPreset(p);
    if (p === "today") { setFrom(today()); setTo(today()); }
    else if (p === "month") { const [s, e] = monthRange(0); setFrom(s); setTo(e); }
    else if (p === "last") { const [s, e] = monthRange(-1); setFrom(s); setTo(e); }
    else if (p === "all") { setFrom(""); setTo(""); }
  };

  const view = useMemo(
    () =>
      bets
        .filter((b) => (!from || b.date >= from) && (!to || b.date <= to))
        .sort((a, b) => (a.date === b.date ? b.seq - a.seq : a.date < b.date ? 1 : -1)),
    [bets, from, to]
  );

  /* --- 집계 --- */
  const sum = useMemo(() => {
    const done = view.filter((b) => b.status !== "pending");
    const hit = done.filter((b) => b.status === "hit").length;
    const staked = done.reduce((a, b) => a + b.stake, 0);
    const profit = done.reduce((a, b) => a + profitOf(b), 0);
    return {
      profit,
      hit,
      miss: done.length - hit,
      total: done.length,
      rate: done.length ? (hit / done.length) * 100 : 0,
      staked,
      roi: staked ? (profit / staked) * 100 : 0,
      pending: view.filter((b) => b.status === "pending").length,
    };
  }, [view]);

  const curve = useMemo(() => {
    const byDay = {};
    view
      .filter((b) => b.status !== "pending")
      .forEach((b) => { byDay[b.date] = (byDay[b.date] || 0) + profitOf(b); });
    let acc = 0;
    return Object.keys(byDay).sort().map((d) => {
      acc += byDay[d];
      return { d, v: acc, day: d.slice(5).replace("-", "/") };
    });
  }, [view]);

  const byCat = useMemo(() => {
    const m = {};
    view.forEach((b) => {
      const k = b.cat || "기타";
      m[k] = m[k] || { cat: k, n: 0, hit: 0, done: 0, staked: 0, profit: 0 };
      m[k].n++;
      if (b.status !== "pending") {
        m[k].done++;
        m[k].staked += b.stake;
        m[k].profit += profitOf(b);
        if (b.status === "hit") m[k].hit++;
      }
    });
    return Object.values(m).sort((a, b) => b.n - a.n);
  }, [view]);

  const maxStake = Math.max(1, ...byCat.map((c) => c.staked));
  const knownCats = useMemo(
    () => Array.from(new Set([...BASE_CATS, ...bets.map((b) => b.cat)])).filter(Boolean),
    [bets]
  );

  /* --- 폼 --- */
  const resetForm = (keepDate = true) => {
    setEditId(null);
    if (!keepDate) setDate(today());
    setMemo(""); setStake(""); setOdds(""); setPayout(""); setStatus("pending");
  };

  // "[LOL] 젠지 2세트 승" 붙여넣으면 종목 자동 분류
  const onMemo = (v) => {
    const m = v.match(/^\s*[[［]([^\]］]{1,8})[\]］]\s*/);
    if (m) { setCat(m[1].trim()); setMemo(v.slice(m[0].length)); }
    else setMemo(v);
  };

  const onStake = (v) => {
    setStake(v);
    if (odds) setPayout(String(Math.round(Number(v || 0) * Number(odds))));
  };
  const onOdds = (v) => {
    setOdds(v);
    if (stake) setPayout(String(Math.round(Number(stake || 0) * Number(v || 0))));
  };
  const onPayout = (v) => {
    setPayout(v);
    if (stake && Number(stake) > 0) setOdds((Number(v || 0) / Number(stake)).toFixed(2));
  };

  const save = () => {
    const s = Number(stake);
    if (!s || s <= 0) { memoRef.current?.focus(); return; }
    const rec = {
      date,
      cat: cat || "기타",
      memo: memo.trim(),
      stake: s,
      odds: Number(odds) || 0,
      expect: Number(payout) || Math.round(s * (Number(odds) || 0)),
      payout: status === "hit" ? Number(payout) || Math.round(s * (Number(odds) || 0)) : 0,
      status,
    };
    if (editId) {
      setBets((p) => p.map((b) => (b.id === editId ? { ...b, ...rec } : b)));
    } else {
      setBets((p) => [{ id: uid(), seq: Date.now(), ...rec }, ...p]);
    }
    resetForm();
    memoRef.current?.focus();
  };

  const edit = (b) => {
    setEditId(b.id); setDate(b.date); setCat(b.cat); setMemo(b.memo);
    setStake(String(b.stake)); setOdds(b.odds ? String(b.odds) : "");
    setPayout(String(b.payout || b.expect || "")); setStatus(b.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const settle = (b, next) =>
    setBets((p) =>
      p.map((x) =>
        x.id === b.id
          ? { ...x, status: next, payout: next === "hit" ? x.expect || Math.round(x.stake * x.odds) : 0 }
          : x
      )
    );

  const remove = (id) => setBets((p) => p.filter((b) => b.id !== id));

  /* --- 백업 --- */
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(bets, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `토계부_${today()}.json`;
    a.click();
  };
  const exportCsv = () => {
    const head = "날짜,종목,메모,배팅금액,배당,당첨금액,상태,수익";
    const body = [...view]
      .map((b) =>
        [b.date, b.cat, `"${b.memo.replace(/"/g, '""')}"`, b.stake, b.odds || "",
         b.payout || 0, { hit: "적중", miss: "미적중", pending: "대기" }[b.status], profitOf(b)].join(",")
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + head + "\n" + body], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `토계부_${from || "전체"}_${to || ""}.csv`;
    a.click();
  };
  const importJson = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(String(r.result));
        if (Array.isArray(data)) {
          const have = new Set(bets.map((b) => b.id));
          setBets((p) => [...data.filter((d) => d && d.id && !have.has(d.id)), ...p]);
        }
      } catch (err) { /* 잘못된 파일 */ }
      e.target.value = "";
    };
    r.readAsText(f);
  };

  /* --- 날짜별 묶기 --- */
  const days = useMemo(() => {
    const g = [];
    view.forEach((b) => {
      const last = g[g.length - 1];
      if (last && last.date === b.date) last.rows.push(b);
      else g.push({ date: b.date, rows: [b] });
    });
    return g;
  }, [view]);

  const statusColor = { hit: "var(--up)", miss: "var(--down)", pending: "var(--wait)" };

  return (
    <div className="tk">
      <style>{CSS}</style>
      <div className="tk-wrap">
        <header className="tk-top">
          <div className="tk-brand">
            <b>토계부</b>
            <span>{bets.length}건 기록됨</span>
          </div>
          <div className="tk-tools">
            <button className="tk-ghost" onClick={exportCsv}>CSV 내려받기</button>
            <button className="tk-ghost" onClick={exportJson}>백업</button>
            <button className="tk-ghost" onClick={() => fileRef.current?.click()}>복원</button>
            <input ref={fileRef} type="file" accept="application/json" onChange={importJson} style={{ display: "none" }} />
          </div>
        </header>

        <div className="tk-range">
          <div className="tk-seg">
            {[["all", "전체"], ["today", "오늘"], ["month", "이번 달"], ["last", "지난달"]].map(([k, label]) => (
              <button key={k} data-on={preset === k ? 1 : 0} onClick={() => applyPreset(k)}>{label}</button>
            ))}
          </div>
          <input className="tk-date" type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPreset("custom"); }} />
          <span style={{ color: "var(--dimmer)" }}>–</span>
          <input className="tk-date" type="date" value={to} onChange={(e) => { setTo(e.target.value); setPreset("custom"); }} />
        </div>

        <section className="tk-hero">
          <div>
            <div className="tk-total-label">기간 수익</div>
            <div className="tk-total num" style={{ color: pnlColor(sum.profit) }}>
              {signed(sum.profit)}<small>원</small>
            </div>
            <div className="tk-meta">
              <span>적중률 <b className="num">{sum.rate.toFixed(1)}%</b> <span className="num">({sum.hit}/{sum.total})</span></span>
              <span>수익률 <b className="num" style={{ color: pnlColor(sum.profit) }}>{sum.roi > 0 ? "+" : ""}{sum.roi.toFixed(1)}%</b></span>
              <span>배팅액 <b className="num">{won(sum.staked)}</b></span>
              {sum.pending > 0 && <span style={{ color: "var(--wait)" }}>대기 {sum.pending}건</span>}
            </div>
          </div>
          <div className="tk-chart">
            {curve.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={curve} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="tkFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={sum.profit >= 0 ? "#3fbf7f" : "#e0605f"} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={sum.profit >= 0 ? "#3fbf7f" : "#e0605f"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: "#5f6b7a", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={28} />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ background: "#1d242e", border: "1px solid #364251", borderRadius: 8, fontSize: 12.5 }}
                    labelStyle={{ color: "#8d98a7" }}
                    formatter={(v) => [signed(v) + "원", "누적"]}
                  />
                  <Area type="monotone" dataKey="v" stroke={sum.profit >= 0 ? "#3fbf7f" : "#e0605f"} strokeWidth={1.75} fill="url(#tkFill)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="tk-empty-chart">정산된 기록이 이틀 이상 쌓이면 누적 곡선이 그려집니다</div>
            )}
          </div>
        </section>

        <div className="tk-grid">
          {/* ------- 왼쪽 ------- */}
          <div>
            <div className="tk-card">
              <div className="tk-card-h">
                <h2>{editId ? "기록 수정" : "빠른 입력"}</h2>
                <em>{editId ? "수정 중" : "Enter로 저장"}</em>
              </div>
              <div className="tk-card-b" onKeyDown={(e) => { if (e.key === "Enter") save(); }}>
                <label className="tk-f">
                  <span>일자</span>
                  <input className="tk-in" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>

                <div className="tk-f">
                  <span>종목</span>
                  <div className="tk-chips">
                    {knownCats.map((c) => (
                      <button
                        key={c}
                        className="tk-chip"
                        onClick={() => setCat(c)}
                        style={
                          cat === c
                            ? { color: catColor(c), borderColor: catColor(c), background: tint(catColor(c), 0.12) }
                            : undefined
                        }
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="tk-f">
                  <span>메모</span>
                  <input
                    ref={memoRef}
                    className="tk-in"
                    value={memo}
                    onChange={(e) => onMemo(e.target.value)}
                    placeholder="젠지 2세트 승"
                  />
                </label>

                <div className="tk-two">
                  <label className="tk-f">
                    <span>배팅금액</span>
                    <input className="tk-in num" inputMode="numeric" value={stake} onChange={(e) => onStake(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" />
                  </label>
                  <label className="tk-f">
                    <span>배당</span>
                    <input className="tk-in num" inputMode="decimal" value={odds} onChange={(e) => onOdds(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="1.85" />
                  </label>
                </div>

                <div className="tk-quick">
                  {[10000, 50000, 100000].map((v) => (
                    <button key={v} onClick={() => onStake(String(Number(stake || 0) + v))}>+{v / 10000}만</button>
                  ))}
                  <button onClick={() => onStake("")}>지우기</button>
                </div>

                <label className="tk-f" style={{ marginTop: 13 }}>
                  <span>당첨금액</span>
                  <input className="tk-in num" inputMode="numeric" value={payout} onChange={(e) => onPayout(e.target.value.replace(/[^0-9]/g, ""))} placeholder="배당을 넣으면 자동 계산" />
                  <div className="tk-calc">
                    {stake && payout
                      ? `적중 시 ${signed(Number(payout) - Number(stake))}원 · 미적중 시 −${won(Number(stake))}원`
                      : ""}
                  </div>
                </label>

                <div className="tk-f">
                  <span>결과</span>
                  <div className="tk-status">
                    {[["hit", "적중"], ["miss", "미적중"], ["pending", "대기"]].map(([k, label]) => (
                      <button
                        key={k}
                        data-on={status === k ? 1 : 0}
                        onClick={() => setStatus(k)}
                        style={status === k ? { borderColor: statusColor[k], background: tint(statusColor[k].startsWith("var") ? "#000" : statusColor[k], 0) , color: statusColor[k] } : undefined}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="tk-submit" onClick={save}>{editId ? "수정 저장" : "기록 추가"}</button>
                {editId && <button className="tk-cancel" onClick={() => resetForm()}>수정 취소</button>}
              </div>
            </div>

            <div className="tk-card">
              <div className="tk-card-h">
                <h2>종목별</h2>
                <em>기간 내</em>
              </div>
              {byCat.length === 0 ? (
                <div className="tk-blank" style={{ padding: "28px 20px" }}>기록이 없습니다</div>
              ) : (
                byCat.map((c) => (
                  <div className="tk-cat" key={c.cat}>
                    <div className="tk-cat-r">
                      <span className="tk-cat-n" style={{ color: catColor(c.cat) }}>{c.cat}</span>
                      <span className="num" style={{ fontWeight: 600, color: pnlColor(c.profit) }}>{signed(c.profit)}</span>
                    </div>
                    <div className="tk-cat-s num">
                      {c.n}건 · 적중 {c.done ? ((c.hit / c.done) * 100).toFixed(0) : 0}% · 수익률{" "}
                      {c.staked ? ((c.profit / c.staked) * 100).toFixed(1) : "0.0"}%
                    </div>
                    <div className="tk-bar">
                      <i style={{ width: `${(c.staked / maxStake) * 100}%`, background: catColor(c.cat), opacity: 0.55 }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ------- 오른쪽 ------- */}
          <div className="tk-card">
            <div className="tk-card-h">
              <h2>기록</h2>
              <em className="num">{view.length}건</em>
            </div>

            {view.length === 0 ? (
              <div className="tk-blank">
                이 기간에는 기록이 없습니다.
                <br />
                왼쪽에서 첫 기록을 추가해 보세요.
                <br />
                <span style={{ fontSize: 12.5 }}>메모에 <code>[LOL] 젠지 2세트 승</code> 형태로 붙여넣으면 종목이 자동으로 분류됩니다.</span>
              </div>
            ) : (
              days.map((g) => {
                const dayProfit = g.rows.reduce((a, b) => a + profitOf(b), 0);
                return (
                  <div key={g.date}>
                    <div className="tk-day">
                      <span className="num">{g.date}</span>
                      <span className="num" style={{ color: pnlColor(dayProfit), fontWeight: 600 }}>
                        {signed(dayProfit)} <span style={{ color: "var(--dimmer)", fontWeight: 400 }}>· {g.rows.length}건</span>
                      </span>
                    </div>
                    {g.rows.map((b) => {
                      const p = profitOf(b);
                      return (
                        <div className="tk-row" key={b.id}>
                          <span>
                            <span className="tk-tag" style={{ color: catColor(b.cat), background: tint(catColor(b.cat), 0.13) }}>
                              {b.cat}
                            </span>
                          </span>
                          <span className="tk-memo">
                            {b.memo || <span style={{ color: "var(--dimmer)" }}>메모 없음</span>}
                            {b.odds ? <i className="num">{Number(b.odds).toFixed(2)}배</i> : null}
                          </span>
                          <span className="tk-r tk-sub num tk-hide-sm">{won(b.stake)}</span>
                          <span className="tk-r tk-sub num tk-hide-sm">{b.status === "pending" ? "—" : won(b.payout)}</span>
                          {b.status === "pending" ? (
                            <span className="tk-settle">
                              <button onClick={() => settle(b, "hit")}>적중</button>
                              <button onClick={() => settle(b, "miss")}>미적중</button>
                            </span>
                          ) : (
                            <span className="tk-r num" style={{ color: pnlColor(p), fontWeight: 600 }}>{signed(p)}</span>
                          )}
                          <span className="tk-act tk-hide-sm">
                            <button className="tk-icon" onClick={() => edit(b)} title="수정">
                              <Pencil />
                            </button>
                            <button className="tk-icon" onClick={() => remove(b.id)} title="삭제">
                              <Trash />
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 아이콘 (외부 의존 없이) */
const Pencil = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const Trash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);
