const dialog = document.querySelector                   ('.film-dialog');
const frame = document.querySelector                ('.player-frame');
const title = document.querySelector                    ('#player-title');
const fallback = document.querySelector                   ('.youtube-fallback');
const poster = document.querySelector                  ('.player-poster');
let playerTrigger                           = null;

const header = document.querySelector             ('.site-header');
const opening = document.querySelector             ('.opening');
if (header && opening) {
  const observer = new IntersectionObserver(([entry]) => {
    header.toggleAttribute('data-dark', !entry.isIntersecting);
  }, { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` });
  observer.observe(opening);
}

document.querySelectorAll                   ('.film-link').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (!dialog || !frame || !title || !fallback || !dialog.showModal) return;
    const id = link.dataset.video;
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;

    event.preventDefault();
    playerTrigger = link;
    title.textContent = link.dataset.title ?? 'Film';
    fallback.href = link.href;
    const thumbnail = link.querySelector                  ('img');
    if (poster && thumbnail) poster.src = thumbnail.currentSrc || thumbnail.src;
    dialog.setAttribute('data-loading', '');
    const player = document.createElement('iframe');
    player.title = `${title.textContent} video player`;
    player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.allowFullscreen = true;
    player.addEventListener('load', () => dialog.removeAttribute('data-loading'), { once: true });
    frame.replaceChildren(player);
    dialog.showModal();
  });
});

document.querySelector                   ('.close-player')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog?.addEventListener('close', () => {
  frame?.replaceChildren();
  poster?.removeAttribute('src');
  dialog.removeAttribute('data-loading');
  playerTrigger?.focus({ preventScroll: true });
});
