import { publish } from 'gh-pages';

console.log('🚀 Starting deployment...');

publish(
  'dist',
  {
    dotfiles: true,
    message: 'Deploy to GitHub Pages'
  },
  (err) => {
    if (err) {
      console.error('❌ Deploy error:', err);
      process.exit(1);
    } else {
      console.log('✅ Deploy complete!');
      console.log('🌐 Your site will be available at your GitHub Pages URL in 1-2 minutes.');
    }
  }
);
