function Test() {
  const dostuff = () => {
      console.log('Hello World');
  }
  return (
      <div>
          <button onClick={dostuff}>Click me</button>
      </div>
  );
}
export default Test;