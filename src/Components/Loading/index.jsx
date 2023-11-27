import './Loading.css';

const Loading = ({ text }) => (
  <div className="loading-container">
    <h3>{text}</h3>
    <div className="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Loading;
