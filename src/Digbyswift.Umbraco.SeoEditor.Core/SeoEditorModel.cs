namespace Digbyswift.Umbraco.SeoEditor.Core;

public class SeoEditorModel
{
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public int? MetaImageId { get; set; }
    public string[] MetaRobots { get; set; } = [];
    public string? CanonicalUrl { get; set; }

    public bool NoIndex => MetaRobots.Contains("noindex");

    public bool HasMetaTitle => !String.IsNullOrWhiteSpace(MetaTitle);
    public bool HasMetaDescription => !String.IsNullOrWhiteSpace(MetaDescription);
    public bool HasCanonicalUrl => !String.IsNullOrWhiteSpace(CanonicalUrl);
}
