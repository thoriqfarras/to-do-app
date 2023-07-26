import '../style.css';
import GithubSvg from './github.svg';

export default function Footer() {
  const footer = document.createElement('footer');

  const text = document.createElement('p');
  text.innerText = `Copyright \u00A9 Thoriq Farras ${new Date().getFullYear()}`;
  footer.appendChild(text);

  const githubIconAnchor = document.createElement('a');
  githubIconAnchor.setAttribute('href', 'https://github.com/thoriqfarras');
  githubIconAnchor.setAttribute('target', '_blank');
  footer.appendChild(githubIconAnchor);

  const githubIcon = document.createElement('img');
  githubIcon.setAttribute('src', GithubSvg);
  githubIconAnchor.appendChild(githubIcon);

  return footer;
}
