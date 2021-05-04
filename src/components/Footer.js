export default function Footer() {
  return (
    <div className="footer">
      <a href="/">
        <button className="btn-cos">New Document</button>
      </a>

      <div
        style={{
          marginTop: "10px",
          maxWidth: "8.5in",
          margin: "auto",
          fontFamily: "monospace, monospace"
        }}
      >
        <h2>CTRL/CMD + S - To Save</h2>
        <h4>Save button is on top for mobile</h4>
        <p>Green - Saved To Database</p>
        <p>Red - Not Saved To Database</p>
        <h3>
          This is a minimalistic clone of google docs, Just share the link in
          the URL with your fellow mates and enjoy real-time updates. G-DOCS is
          powered by socket.io and MongoDB Atlas on backend servers of Heroko
          and on Frontend it's all React, React-Router, and Quill Text Editor.
        </h3>
      </div>
      <div>
        <h2>
          <a
            href="https://sushil-kamble.netlify.app/"
            rel="noopener"
            target="_black"
            style={{ marginBottom: "50px" }}
          >
            Sushil Kamble
          </a>
        </h2>
      </div>
    </div>
  );
}
