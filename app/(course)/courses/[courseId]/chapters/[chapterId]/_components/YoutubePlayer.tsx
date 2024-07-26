export function YoutubePlayer({url}:{url:string}) {
  return <iframe className="w-full h-[476px]" src={url}></iframe>;
}
