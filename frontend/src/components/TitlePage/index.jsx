export default function TitlePage(props) {
  return (
    <h1 className="font-bold text-3xl mb-8 border-b-4 pb-2 w-56">
      {props.title}
    </h1>
  );
}
