const fs = require('fs');

const filePath = 'services.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add CSS for smooth accordion
const cssToAdd = `
        .card-details-content {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.4s ease-out, opacity 0.4s ease-out, margin-top 0.4s ease-out;
            opacity: 0;
            margin-top: 0;
        }
        .card-details-content.expanded {
            grid-template-rows: 1fr;
            opacity: 1;
            margin-top: 0.5rem;
        }
        .card-details-inner {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .rotate-180 {
            transform: rotate(180deg);
        }
`;

if (!content.includes('.card-details-content')) {
    content = content.replace('</style>', cssToAdd + '    </style>');
}

// 2. Add JS for toggle
const jsToAdd = `
    <script>
        function toggleCardDetails(btn) {
            const contentDiv = btn.nextElementSibling;
            const icon = btn.querySelector('.fa-chevron-down');
            const textSpan = btn.querySelector('.btn-text');
            
            contentDiv.classList.toggle('expanded');
            
            if (contentDiv.classList.contains('expanded')) {
                icon.classList.add('rotate-180');
                textSpan.textContent = 'Hide Details';
                btn.classList.replace('bg-brand-50', 'bg-brand-900');
                btn.classList.replace('text-brand-600', 'text-white');
                btn.classList.replace('hover:bg-brand-100', 'hover:bg-brand-800');
            } else {
                icon.classList.remove('rotate-180');
                textSpan.textContent = 'View Details';
                btn.classList.replace('bg-brand-900', 'bg-brand-50');
                btn.classList.replace('text-white', 'text-brand-600');
                btn.classList.replace('hover:bg-brand-800', 'hover:bg-brand-100');
            }
        }
    </script>
`;

if (!content.includes('function toggleCardDetails')) {
    content = content.replace('</body>', jsToAdd + '\\n</body>');
}

// 3. Process each card to match the new structure
const cardRegex = /<div class="w-full p-8 lg:p-10 flex flex-col justify-start flex-grow">\\s*<div class="w-14 h-14 bg-blue-50 text-brand-600 rounded-xl flex items-center justify-center text-2xl mb-6">\\s*(<i class=".*"><\\/i>)\\s*<\\/div>\\s*<h3 class="font-heading text-3xl font-bold text-brand-900 mb-4">(.*?)<\\/h3>\\s*(<p class="text-gray-600 mb-6 leading-relaxed">[\\s\\S]*?)<a href="contact\\.html" class="inline-block border-2 border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white font-bold px-8 py-3 rounded-full transition-colors w-max mt-auto">Apply Now<\\/a>\\s*<\\/div>/g;

content = content.replace(cardRegex, (match, iconHtml, titleHtml, innerContentHtml) => {
    return \`
                <div class="w-full p-6 lg:p-8 flex flex-col justify-start flex-grow">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-14 h-14 bg-blue-50 text-brand-600 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm">
                            \${iconHtml}
                        </div>
                        <h3 class="font-heading text-2xl md:text-3xl font-bold text-brand-900 leading-tight">\${titleHtml}</h3>
                    </div>
                    
                    <button onclick="toggleCardDetails(this)" class="w-full bg-brand-50 hover:bg-brand-100 text-brand-600 font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2 shadow-sm">
                        <span class="btn-text">View Details</span> <i class="fas fa-chevron-down transform transition-transform duration-300"></i>
                    </button>

                    <div class="card-details-content">
                        <div class="card-details-inner">
                            <div class="pt-6 flex flex-col flex-grow">
                                \${innerContentHtml.trim()}
                                <div class="mt-8">
                                    <a href="contact.html" class="inline-block bg-brand-900 text-white hover:bg-brand-800 font-bold px-8 py-3 rounded-full transition-colors w-max shadow-md">Apply Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>\`.trim();
});

content = content.replace(/h-64 md:h-80/g, 'h-56 md:h-64');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated the file with JS accordion logic.');
