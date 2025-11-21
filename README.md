# prmarketing
Store marketing email JSON files
## Live URL
The below url is the web accessible link that can be used to link to various json files in Klaviyo or other platforms.

 https://pruixu.github.io/prmarketing/

### Validate JSON
If you are trouble loading the json file, you are receiving errors, etc., please make sure that json file doesn't contain any formatting or structure errors. You can use the below link to validate the JSON file.

https://jsonlint.com/


# 📘 Klaviyo Email Development 101 (with JSON translations)

## 1. Why This Guide?
This guide is for developers creating **multi-language emails in Klaviyo** using JSON-based translations.  
It covers best practices for HTML structure, inline CSS, Outlook fallbacks, Gmail quirks, and translation handling.

---

## 2. HTML Email Basics
- Always use **tables** for layout, never rely on `div` or CSS grid/flex.  
- Keep **inline CSS** styles (many clients strip `<style>`).  
- Set a background color fallback.  
- Use **alt text** for all images.  
- Max email width: **600px** is standard.  

---

## 3. Using Translations in JSON

All translations are managed in the [prmarketing GitHub repository](https://github.com/pruixu/prmarketing).

- The **`subjects`** folder contains JSON files for email subjects and preheaders.
- The **`templates`** folder contains JSON files for the email body content.

Store text in JSON per language, for example:

```json
{
[
  {
    "language_name": "English",
    "pr_code": "eng",
    "language": "en-US",
    "congrats_header": " CONGRATS, YOU'VE REACHED A NEW LOYALTY TIER!"
  },
  {
    "language_name": "Azerbaijani",
    "pr_code": "aze",
    "language": "az",
    "congrats_header": "TƏBRİKLƏR, SİZ YENİ LOJALLIK SƏVİYYƏSİNƏ ÇATDINIZ!"
  }
]
}
```

In Klaviyo, you can select the proper key with Liquid/Django syntax:

```django
{% if person.language == "es" %}
  {{ translations.es.title }}
{% else %}
  {{ translations.en.title }}
{% endif %}
```

### 3.2 How to Create a Web Feed in Klaviyo

To use your JSON translations in Klaviyo, you need to create a **Web Feed**. Here’s how:

1. **Host your JSON file**  
   Upload your JSON file to a public location (for example, use the GitHub raw link from [prmarketing](https://github.com/pruixu/prmarketing)).

2. **Copy the public URL**  
   Make sure the URL points directly to the raw JSON file (e.g., `https://raw.githubusercontent.com/pruixu/prmarketing/main/templates/loyalty_points.json`).

3. **Log in to Klaviyo**  
   Go to [Klaviyo](https://www.klaviyo.com/) and log in to your account.

4. **Go to Account Settings**  
   Click your account name (bottom left), then select **Settings**.

5. **Navigate to Data Feeds**  
   In the left sidebar, click **Other** and then select **Web Feeds**.

6. **Add a New Web Feed**  
   Click the **Add Web Feed** button.

7. **Paste your JSON URL**  
   In the popup, paste the public URL of your JSON file.

8. **Name your feed**  
   Give your feed a clear name (e.g., `loyalty_points`).

9. **Save and fetch**  
   Click **Save**. Klaviyo will fetch and cache the JSON. You should see a preview of your data.

10. **Reference in your template**  
    Use Klaviyo’s template syntax to access translations, for example:

## 3.3 How to Generate New Translations

When you need to add a new set of translations for an email:

1. **Start with English JSON:**  
   Create a JSON object with all the keys and values in English. For example:
   ```json
   [
     {
       "language_name": "English",
       "pr_code": "eng",
       "language": "en-US",
       "congrats_header": "CONGRATS, YOU'VE REACHED A NEW LOYALTY TIER!",
       "say_hello": "Say Hello to your new status:"
     }
   ]
   ```

2. **List the target languages:**  
   Prepare a list of all languages you need, for example:  
   Azerbaijani, Bulgarian, Danish, German, Greek, Finnish, French, Croatian, Hungarian, Indonesian, Italian, Japanese, Korean, Malay, Dutch, Norwegian, Polish, Portuguese, Romanian, Russian, Slovak, Slovenian, Spanish, Swedish, Thai, Turkish, Vietnamese, Chinese Simplified, Chinese Traditional.

3. **Use AI or a translation service:**  
   Ask an AI (like ChatGPT) or a professional translation service to translate the English values for each key into all target languages, keeping the same JSON structure.  
   Example prompt for AI:  
   > Please translate the following JSON keys and values into [target language], keeping the same structure.
   > Target Languages "Azerbaijani, Bulgarian, Danish, German, Greek, Finnish, French, Croatian, Hungarian, Indonesian, Italian, Japanese, Korean, Malay, Dutch, Norwegian, Polish, Portuguese, Romanian, Russian, Slovak, Slovenian, Spanish, Swedish, Thai, Turkish, Vietnamese, Chinese Simplified, Chinese Traditional."

4. **Combine all translations:**  
   Add each translated object to your JSON array, updating `"language_name"`, `"pr_code"`, and `"language"` as needed for each language.

5. **Validate your JSON:**  
   Use a tool like [JSONLint](https://jsonlint.com/) to ensure your file is valid before uploading.

6. **Push to Git:**  
   Commit and push your updated JSON file(s) to the [prmarketing GitHub repository](https://github.com/pruixu/prmarketing) so they are available for use in Klaviyo and by your team.

---

## 4. Example Block (Title + Image + Button)
```html
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">

        <!-- Title -->
        <tr>
          <td style="font-size:24px; font-weight:bold; color:#123066; text-align:center; padding:20px;">
            {{ translations.title }}
          </td>
        </tr>

        <!-- Image with Link -->
        <tr>
          <td align="center" style="padding:10px;">
            <a href="{{ shop.url }}">
              <img src="{{ translations.image_url }}" alt="{{ translations.title }}" width="100%" style="max-width:600px; border:0; display:block;">
            </a>
          </td>
        </tr>

        <!-- CTA Button -->
        <tr>
          <td align="center" style="padding:20px;">
            <a href="{{ shop.url }}" 
               style="background:#F5A623; color:#fff; font-size:18px; font-weight:bold;
                      padding:14px 28px; border-radius:6px; text-decoration:none;">
              {{ translations.cta }}
            </a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
```

---

## 5. Example JSON for That Block
```json
{
[
  {
    "language_name": "English",
    "pr_code": "eng",
    "language": "en-US",
    "congrats_header": " CONGRATS, YOU'VE REACHED A NEW LOYALTY TIER!"
  }
]
}
```

---

## 6. Tips for Better Email Development
- **Always add links** → every section should be clickable (title, image, button).  
- **Use titles** → start blocks with headlines for clarity.  
- **Images should be linked** → never leave them as decoration only.  
- **Mobile-first design** → min font 16px, buttons >44px tall.  
- **Fallbacks matter** → alt text, safe fonts, safe colors.  
- **Track CTAs** → ensure all CTAs are trackable.  

---

## 7. Special Considerations for Outlook
Outlook (especially 2016 and below) uses Word to render emails → limited CSS.

### Key Tips
- Use **tables** only.  
- Avoid `margin`; use padding inside `<td>`.  
- For background images, use **VML fallback**.  
- Use conditional comments:

```html
<!--[if mso]>
<p style="font-size:16px; color:#333;">This text is for Outlook only</p>
<![endif]-->
```

### Example: Outlook-Compatible Button
```html
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" 
             xmlns:w="urn:schemas-microsoft-com:office:word" 
             href="https://yourshop.com" 
             style="height:50px; v-text-anchor:middle; width:200px;" 
             arcsize="10%" strokecolor="#F5A623" fillcolor="#F5A623">
  <w:anchorlock/>
  <center style="color:#ffffff; font-family:sans-serif; font-size:16px; font-weight:bold;">
    Shop Now
  </center>
</v:roundrect>
<![endif]-->

<!--[if !mso]><!-- -->
<a href="https://yourshop.com" 
   style="background:#F5A623; color:#ffffff; padding:15px 30px; 
          text-decoration:none; border-radius:6px; font-weight:bold; 
          display:inline-block;">
   Shop Now
</a>
<!--<![endif]-->
```

---

## 8. Gmail Line Length & Clipping
Gmail sometimes clips emails if:
- Email is larger than **~102KB**.  
- Or if a single line of code is **too long**.

### Fixes:
- Keep email under **100KB**.  
- Break long lines manually in HTML.  
- Provide a **“View in Browser”** link:

```html
<p style="font-size:14px; color:#666;">
  Having trouble viewing this email? 
  <a href="{{ view_in_browser_url }}" style="color:#123066;">View in your browser</a>
</p>
```

---

## 9. Best Practice Summary
- Use **tables**, not divs.  
- Inline all CSS.  
- Use MSO conditionals for Outlook.  
- Keep under 100KB.  
- Add alt text everywhere.  
- Make every block clickable.  

---

## 10. Responsive Design with a Single Table
- **Plan for desktop & mobile in one table:**  
  If your design needs to look different on desktop (e.g., 1 row with 4 columns) and mobile (e.g., 2 rows with 2 columns), try to use a single table structure.  
  - Use classes like `.m-hide` (display:none on mobile) and `.d-hide` (display:none on desktop) to show/hide table rows or cells as needed.
  - For Outlook, use conditional comments (`<!--[if !mso]> ... <!--<![endif]-->`) to target non-Outlook clients for mobile-specific code.
  - **Example:**  
    ```html
    <tr class="desktop-row">
      <td class="m-hide">Col 1</td>
      <td class="m-hide">Col 2</td>
      <td class="m-hide">Col 3</td>
      <td class="m-hide">Col 4</td>
    </tr>
    <!--[if !mso]><!-->
    <tr class="mobile-row">
      <td colspan="2" class="d-hide">Col 1</td>
      <td colspan="2" class="d-hide">Col 2</td>
    </tr>
    <tr class="mobile-row">
      <td colspan="2" class="d-hide">Col 3</td>
      <td colspan="2" class="d-hide">Col 4</td>
    </tr>
    <!--<![endif]-->
    ```

    - **Example 2:**  
    ```html
    <tr class="desktop-row">
      <td class="m-50">Col 1</td>
      <td class="m-50">Col 2</td>
      <td class="m-hide">Col 3</td>
      <td class="m-hide">Col 4</td>
    </tr>
    <!--[if !mso]><!-->
    <tr class="mobile-row">
      <td colspan="2" class="d-hide">Col 3</td>
      <td colspan="2" class="d-hide">Col 4</td>
    </tr>
    <!--<![endif]-->
    ```
  - This keeps your code maintainable and ensures both desktop and mobile render correctly.

---

## 11. User Acceptance Criteria

- [ ] Subject and preheader correct
- [ ] All links tested
- [ ] Images display correctly
- [ ] Responsive on desktop and mobile
- [ ] No typos or grammar errors
- [ ] All translations correct
- [ ] Every element (img, p, h1) must be linkable if required
- [ ] Make sure old Outlook versions render correctly



*This process ensures all your emails are ready for multi-language support and easy integration with Klaviyo web feeds.*


