export function YoutubePlayer({url}:{url:string}) {
  return (
    <video width="320" height="240" controls preload="none">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
