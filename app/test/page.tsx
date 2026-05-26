'use client'

export default function TestPage() {
  return (
    <div style={{ padding: 40 }}>
      <button
        style={{
          padding: 30,
          fontSize: 24,
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          width: '100%',
        }}
        onClick={() => alert('KAM KAR RAHA HAI!')}
      >
        CLICK ME
      </button>
    </div>
  )
}