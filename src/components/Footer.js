export default function Footer() {
  return (
    <div className="footer">
      <a href="/">
        <button class="btn-cos">New Document</button>
      </a>

      <div
        style={{
          marginTop: "10px",
          maxWidth: "8.5in",
          margin: "auto",
          fontFamily: "monospace, monospace"
        }}
      >
        <h3>
          This is minimalistic clone of google docs, Just share the link in the
          url with your fellow mates and enjoy realtime updates. G-DOC is
          powered by socket.io and mongoDb Atlas on backend servers of Hereko
          and on Frontend its all React, React-Router and Quill Text Editor.
        </h3>
      </div>
      <div>
        <h2>
          <a
            href="https://sushil-kamble.netlify.app/"
            rel="noopener"
            target="_black"
          >
            Sushil Kamble
          </a>
        </h2>
      </div>
    </div>
  );
}
