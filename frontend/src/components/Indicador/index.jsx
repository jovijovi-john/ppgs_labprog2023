/* eslint-disable react/prop-types */
export default function Indicador(props) {
  return (
    <div className="flex p-4 rounded-md border border-zinc-900 bg-zinc-900">
      <div className={`w-16 h-14 rounded ${props.color}`} />
      <div className="ml-4 h-full  justify-between">
        <h4 className="font-semibold text-sm text-zinc-300">{props.title}</h4>
        <span className="block mt-2 text-sm font-bold">{props.value}</span>
      </div>
    </div>
  );
}
