export function YoutubePlayer({url}:{url:string}) {
  return (
    <iframe width="560" height="315" src={url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  );
}
