<?php

/**
 * Generates an email-safe HTML table for inserted books.
 * 
 * @param array $booksInsertedByPr List of books (can be arrays or objects)
 * @return string The complete HTML string ready to be injected into an email body
 */
function generateBooksEmailTable(array $booksInsertedByPr): string 
{
    // Return an empty string if there are no books to display
    if (empty($booksInsertedByPr)) {
        return '';
    }

    // Map condition keys to Italian labels
    $conditionLabels = [
        'new'     => 'Nuovo',
        'optimal' => 'Ottimo',
        'good'    => 'Buono',
        'bad'     => 'Usurato'
    ];

    // Start capturing the output instead of printing it to the screen
    ob_start(); 
    ?>
    <div style="overflow-x: auto; margin: 1rem 0;">
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; background-color: #ffffff; font-family: sans-serif box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border: 1px solid #dddddd;">
            <thead>
                <tr style="background-color: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dddddd; font-weight: 600; color: #495057;">ISBN</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dddddd; font-weight: 600; color: #495057;">Titolo</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dddddd; font-weight: 600; color: #495057;">Autore</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dddddd; font-weight: 600; color: #495057;">Editore</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dddddd; font-weight: 600; color: #495057;">Prezzo</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dddddd; font-weight: 600; color: #495057;">Condizioni</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($booksInsertedByPr['books'] as $book): 
                    // Safely cast to object so it works regardless of array or object inputs
                    $book = (object)$book; 
                    
                    // Format price securely
                    $price = !empty($book->Price_new) ? number_format((float)$book->Price_new, 2, ',', '.') : '0,00';
                    
                    // Fallback configuration for conditions
                    $conditionKey = $book->Dec_conditions ?? 'good';
                    $conditionText = $conditionLabels[$conditionKey] ?? 'Buono';
                ?>
                    <tr>
                        <td style="padding: 12px; text-align: left; border-bottom: 1px solid #dddddd; color: #333333;"><?php echo htmlspecialchars($book->ISBN ?? ''); ?></td>
                        <td style="padding: 12px; text-align: left; border-bottom: 1px solid #dddddd; color: #333333;"><?php echo htmlspecialchars($book->Title ?? ''); ?></td>
                        <td style="padding: 12px; text-align: left; border-bottom: 1px solid #dddddd; color: #333333;"><?php echo htmlspecialchars($book->Author ?? ''); ?></td>
                        <td style="padding: 12px; text-align: left; border-bottom: 1px solid #dddddd; color: #333333;"><?php echo htmlspecialchars($book->Editor ?? ''); ?></td>
                        <td style="padding: 12px; text-align: left; border-bottom: 1px solid #dddddd; color: #333333;">€<?php echo $price; ?></td>
                        <td style="padding: 12px; text-align: left; border-bottom: 1px solid #dddddd; color: #333333;"><?php echo htmlspecialchars($conditionText); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
    // Read the buffer content into a variable and clean the buffer
    return ob_get_clean();
}