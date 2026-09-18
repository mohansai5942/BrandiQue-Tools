export const collections=[
 ['image-tools','Image Tools','Free Image Tools Online','Resize images, reduce file size and annotate screenshots in your browser. Choose the image resizer for dimensions, the compressor for file size, or the screenshot editor for annotations.'],
 ['pdf-tools','PDF Tools','Free PDF Tools Online','Merge PDF files, split page ranges, optimize PDF structure or combine images into a PDF. These tools process your selected files locally; keep the originals and review downloaded results.'],
 ['document-tools','Document Tools','Document Conversion Tools','Choose Document Format Converter for supported PDF, Word and spreadsheet conversions, or Document Converter for structured text. Each tool explains supported outputs and formatting limitations before conversion.'],
 ['video-tools','Video Tools','Free Video Tools Online','Resize compatible videos, reduce resolution or bitrate, and extract audio in your browser. Output formats depend on browser recording support; these tools do not promise every video codec.'],
 ['calculators','Calculators','Free Online Calculators','Calculate age, percentages, loan EMI, discounts and GST with dedicated inputs and clear results. Check your assumptions and selected rates before using an estimate.'],
 ['converters','Converters','Free Unit and File Converters','Convert lengths, areas, temperatures, volumes, weights, speeds and power, or choose a supported file conversion. Dedicated unit pages help you select the right measurement and avoid mixing incompatible units.'],
 ['resume-tools','Resume Tools','Free Resume ATS Checker','Check a PDF, DOCX or text resume for readable content, structure and job-keyword coverage. The score is a transparent readiness estimate, not an employer ATS result or a hiring guarantee.'],
 ['utilities','Utilities','Free Text and Developer Tools','Format or validate JSON, encode Base64 and URL components, count words, change text case, convert colors and timestamps, generate passwords or create QR codes. Choose a focused tool for the task.']
];
export const extraPaths=['/sitemap/',...collections.map(([slug])=>`/collections/${slug}/`)];
