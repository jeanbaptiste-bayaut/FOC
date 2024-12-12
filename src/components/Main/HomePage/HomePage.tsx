import './HomePage.scss';

const HomePage = () => {
  return (
    <div>
      <h1>FOC REQUEST TOOL</h1>
      <section className="homepage-buttons">
        <a href="/coupons">Coupons</a>
        <a href="/report">Report</a>
        <a href="/upload">Upload</a>
        <a href="/export">Export</a>
      </section>
    </div>
  );
};

export default HomePage;
