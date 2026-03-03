## Table of Contents
- [Live URL](#live-url)
- [Validate JSON](#validate-json)
- [Klaviyo Email Development 101 (with JSON translations)](#-klaviyo-email-development-101-with-json-translations)
  - [1. Why This Guide?](#1-why-this-guide)
  - [2. HTML Email Basics](#2-html-email-basics)
  - [3. Using Translations in JSON](#3-using-translations-in-json)
    - [3.1 Language Code Normalization and Variants](#31-language-code-normalization-and-variants)
    - [3.2 Using Translations in Klaviyo](#32-using-translations-in-klaviyo)
    - [3.3 Automation: Expanding and Validating Translations](#33-automation-expanding-and-validating-translations)
      - [Available Commands](#available-commands)
      - [Running for a single file](#running-for-a-single-file)
      - [Example workflow](#example-workflow)
  - [4. Example Block (Title + Image + Button)](#4-example-block-title--image--button)
    - [4.1 Example JSON for That Block](#41-example-json-for-that-block)
  - [5. Tips for Better Email Development](#5-tips-for-better-email-development)
  - [6. Special Considerations for Outlook](#6-special-considerations-for-outlook)
  - [7. Gmail Line Length & Clipping](#7-gmail-line-length--clipping)
  - [8. Best Practice Summary](#8-best-practice-summary)
  - [9. Responsive Design with a Single Table](#9-responsive-design-with-a-single-table)
  - [10. User Acceptance Criteria (UAC) Checklist](#10-user-acceptance-criteria-uac-checklist)

## 3. Using Translations in JSON

All translations are managed in this repository using JSON files per language and variant. The recommended workflow is:

1. **Edit or add keys only in the base language** (e.g., `"language": "en"`).
2. **Run the expansion script** to automatically generate all required variants (according to BCP-47 and `src/variations.json`).
3. **Automatic synchronization:** If you add a new key in the base language, the script will add it to all variants that don't have it, copying the value from the base.
4. **Validate the files** to ensure there are no syntax errors.

**Example structure:**
```json
[
  {
    "language_name": "English",
    "language": "en",
    "congrats_header": "CONGRATS, YOU'VE REACHED A NEW LOYALTY TIER!"
  },
  {
    "language_name": "Spanish",
    "language": "es",
    "congrats_header": "¡FELICIDADES, HAS ALCANZADO UN NUEVO NIVEL DE LEALTAD!"
  }
]
```
# prmarketing

## 3. Using Translations in JSON

All translations are managed in this repository using JSON files per language and variant. The recommended workflow is:

1. **Edit or add keys only in the base language** (e.g., `"language": "en"`).
2. **Run the expansion script** to automatically generate all required variants (according to BCP-47 and `src/variations.json`).
3. **Automatic synchronization:** If you add a new key in the base language, the script will add it to all variants that don't have it, copying the value from the base.
4. **Validate the files** to ensure there are no syntax errors.

**Example structure:**
```json
[
  {
    "language_name": "English",
    "language": "en",
    "congrats_header": "CONGRATS, YOU'VE REACHED A NEW LOYALTY TIER!"
  },
  {
    "language_name": "Spanish",
    "language": "es",
    "congrats_header": "¡FELICIDADES, HAS ALCANZADO UN NUEVO NIVEL DE LEALTAD!"
  }
]
```

### 3.1 Language Code Normalization and Variants

- The `language` property must contain the base language code (e.g., `"en"`, `"es"`).
- The script will automatically generate variants like `"en-US"`, `"es-MX"`, etc., based on the configuration in `src/variations.json`.
- If you add a new key to the base language, running the script will propagate it to all variants.

### 3.2 Using Translations in Klaviyo

For **subject lines and preheaders**, use the `in` operator to check if the base language code is contained in the full locale:

```django
# Django template example for subject lines
{# with feed=feeds.YourSubjectFeed #}
  {% for item in feed %}
    {% if item.language in person|lookup:"Last Purchase Language"|default_if_none:"en-US" %}
      ...
    {% endif %}
  {% endfor %}
{# endwith #}
```

For **email body content**, extract the base language code using `slice:":2"` and compare:

```django
# Django template example for email body content
{# with feed=feeds.YourContentFeed #}
  {# with language=person|lookup:"Last Purchase Language"|default:"en-US" #}
    {# with langBase=language|slice:":2" #}
      ...
    {# endwith #}
  {# endwith #}
{# endwith #}
```

### 3.3 Automation: Expanding and Validating Translations

This project includes automation scripts to help you expand translation variants and validate all JSON files for Klaviyo email campaigns.

#### Available Commands

You can run these commands from the `prmarketing` directory:

| Command                      | Description                                                        |
|------------------------------|--------------------------------------------------------------------|
| `npm run expand`             | Expands and synchronizes variants in all JSON files                 |
| `npm run validate`           | Validates the syntax of all JSON files                              |
| `npm run expand-and-validate`| Runs both steps in sequence                                         |

**How to use:**
```sh
npm run expand
npm run validate
npm run expand-and-validate
```

#### Running for a single file

To expand/synchronize only one file:
```sh
node src/translate.js path/to/file.json
```

#### Example workflow

1. Edit the base file (e.g., `templates/loyalty_points.json`), adding or modifying keys only in `"en"`.
2. Run `npm run expand` to propagate changes to all variants.
3. Run `npm run validate` to check that everything is correct.
4. Commit and push your changes to GitHub.

> **Note:** Always run the expansion script after adding new keys to ensure all variants are up to date.

You can find and modify these scripts in the `package.json` file.

---
      {% for item in feed %}
        {% if item.language == langBase %}
          {{ item.pre_header_variation_3 }}
        {% endif %}
      {% endfor %}
    {% endwith %}
  {% endwith %}
{% endwith %}
```
<!-- {% endraw %} -->

**Complete Example (Loyalty Points Content):**
<!-- {% raw %} -->
```django
{% with langFeed=feeds.loyaltyPoints %}
  {% with language=person|lookup:"Last Purchase Language"|default:"en-US" %}
    {% with langBase=language|slice:":2" %}
      {% for langItem in langFeed %}
        {% if langItem.language == langBase %}
          <h1>{{ langItem.congrats_header }}</h1>
          <p>{{ langItem.say_hello }}</p>
        {% endif %}
      {% endfor %}
    {% endwith %}
  {% endwith %}
{% endwith %}
```
<!-- {% endraw %} -->

---

#### 🚀 Automation: Expanding and Validating Translations

This project includes automation scripts to help you expand translation variations and validate all JSON files for Klaviyo email campaigns.

##### Available Commands

You can run these commands from the `prmarketing` directory:

| Command                | Description                                                      |
|------------------------|------------------------------------------------------------------|
| `npm run expand`       | Expands translation variations in all JSON files                  |
| `npm run validate`     | Validates all JSON files in `subjects` and `templates` folders    |
| `npm run expand-and-validate` | Expands translations and then validates all JSON files         |

**How to Use**

1. **Install Node.js** (v16+ recommended)
2. Open a terminal in the `prmarketing` directory
3. Run any of the commands above, for example:

```sh
npm run expand
npm run validate
npm run expand-and-validate
```

**What do these scripts do?**
- `expand` will process all JSON translation files, generating all BCP-47 language variations as needed.
- `validate` will check every JSON file for syntax errors and report any issues.
- `expand-and-validate` will run both steps in sequence, ensuring your files are always up to date and valid.

You can find and modify these scripts in the `package.json` file.

---


### 3.4 Why This Approach?

**Problem we solved:**
- Previously, JSON files had inconsistent `language` values (some with regions like `"zh-CHS"`, others without)
- Customer profiles have full locales like `"en-US"`, `"es-MX"`, `"zh-CN"`
- This caused **mismatching** → emails with **empty subject lines** for international users

**Solution:**
- ✅ Now, all JSON files are automatically expanded to include all required BCP-47 language variants (e.g., `"en"`, `"en-US"`, `"es"`, `"es-MX"`, etc.)
- ✅ Any new key added to the base language is propagated to all variants, ensuring consistency
- ✅ In Klaviyo, you can match either by checking if the variant is present, or by extracting the base code as needed
- ✅ Result: **100% match rate** for all languages and locales, and all variants are always up to date

### 3.5 How to Create a Web Feed in Klaviyo

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


### 3.6 How to Generate New Translations

When you need to add a new set of translations for an email:

1. **Start with English JSON:**  
  Create a JSON object with all the keys and values in English. For example:
  ```json
  [
    {
     "language_name": "English",
     "pr_code": "eng",
     "language": "en",
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

5. **Generate all language variants automatically:**
  Use the automation script to expand all BCP-47 language variants for your new translation set:

  ```sh
  npm run expand
  ```

  This will process all JSON files and generate the necessary language code variations automatically.

6. **Validate your JSON:**  
  Use the validation script to ensure your file is valid before uploading:

  ```sh
  npm run validate
  ```

  Or run both steps in sequence:

  ```sh
  npm run expand-and-validate
  ```

7. **Push to Git:**  
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

### 4.1 Example JSON for That Block
```json
[
  {
    "language_name": "English",
    "pr_code": "eng",
    "language": "en",
    "congrats_header": " CONGRATS, YOU'VE REACHED A NEW LOYALTY TIER!"
  }
]
```

---

## 5. Tips for Better Email Development
- **Always add links** → every section should be clickable (title, image, button).  
- **Use titles** → start blocks with headlines for clarity.  
- **Images should be linked** → never leave them as decoration only.  
- **Mobile-first design** → min font 16px, buttons >44px tall.  
- **Fallbacks matter** → alt text, safe fonts, safe colors.  
- **Track CTAs** → ensure all CTAs are trackable.  

---

## 6. Special Considerations for Outlook
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

## 7. Gmail Line Length & Clipping
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

## 8. Best Practice Summary
- Use **tables**, not divs.  
- Inline all CSS.  
- Use MSO conditionals for Outlook.  
- Keep under 100KB.  
- Add alt text everywhere.  
- Make every block clickable.  

---

## 9. Responsive Design with a Single Table
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

## 10. User Acceptance Criteria (UAC) Checklist
Before finalizing your email, ensure the following checklist is complete:
- [ ] Subject and preheader correct
- [ ] All links tested
- [ ] Images display correctly
- [ ] Responsive on desktop and mobile
- [ ] No typos or grammar errors
- [ ] All translations correct
- [ ] Every element (img, p, h1) must be linkable if required
- [ ] Make sure old Outlook versions render correctly

*This process ensures all your emails are ready for multi-language support and easy integration with Klaviyo web feeds.*


