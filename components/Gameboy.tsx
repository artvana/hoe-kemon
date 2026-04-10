'use client'

import './gameboy.css'

interface GameboyProps {
  children?: React.ReactNode
}

export default function Gameboy({ children }: GameboyProps) {
  return (
    <div className="gameboy-outer">
      <div className="gameboy">

        {/* ── Display section ─────────────────────────────────────────────── */}
        <div className="display-section">
          <div className="screen-area">

            {/* Power indicator */}
            <div className="power">
              <div className="indicator">
                <div className="led"></div>
                <span className="arc" style={{ zIndex: 2 }}></span>
                <span className="arc" style={{ zIndex: 1 }}></span>
                <span className="arc" style={{ zIndex: 0 }}></span>
              </div>
              POWER
            </div>

            {/* THE SCREEN — scene content renders here */}
            <div className="display">
              {children}
            </div>

            {/* GAME BOY label */}
            <div className="label">
              <div className="title">GAME BOY</div>
              <div className="subtitle">
                <span className="c">C</span>
                <span className="o1">O</span>
                <span className="l">L</span>
                <span className="o2">O</span>
                <span className="r">R</span>
              </div>
            </div>
          </div>

          <div className="nintendo">Nintendo</div>
        </div>

        {/* ── Control section (mobile only) ───────────────────────────────── */}
        <div className="control-section">
          <div className="controls">
            {/* D-pad */}
            <div className="dpad">
              <div className="up"><i>▲</i></div>
              <div className="right"><i>▶</i></div>
              <div className="down"><i>▼</i></div>
              <div className="left"><i>◀</i></div>
              <div className="middle"></div>
            </div>

            {/* A / B */}
            <div className="a-b">
              <div className="b">B</div>
              <div className="a">A</div>
            </div>
          </div>

          {/* Start / Select */}
          <div className="start-select">
            <div className="select">SELECT</div>
            <div className="start">START</div>
          </div>
        </div>

        {/* ── Speaker grille (mobile only) ────────────────────────────────── */}
        <div className="speaker">
          <div className="dot placeholder"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot placeholder"></div>

          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>

          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>

          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>

          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>

          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>

          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>

          <div className="dot placeholder"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot closed"></div>
          <div className="dot open"></div>
          <div className="dot placeholder"></div>
        </div>

      </div>
    </div>
  )
}
