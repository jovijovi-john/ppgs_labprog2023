/* eslint-disable react/prop-types */
export default function Indicador(props) {
  return (
    <div className="flex p-4 rounded-md border border-zinc-900 bg-zinc-900 w-96">
      <div className={`w-[70px] h-[68px] rounded ${props.color}`} />
      <div className="ml-4 h-full  justify-between">
        <h4 className="font-semibold text-md text-zinc-300">{props.title}</h4>
        <span className="block mt-2 text-md font-bold">{props.value}</span>
      </div>
    </div>
  );
}
