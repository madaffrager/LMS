export function YoutubePlayer({url}:{url:string}) {
  return <iframe className="w-full h-[300px]" src={url}></iframe>;
}
