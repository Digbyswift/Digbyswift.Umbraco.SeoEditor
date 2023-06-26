using Newtonsoft.Json;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace Digbyswift.Umbraco.SeoEditor.Core;

public sealed class SeoEditorPropertyConverter : PropertyValueConverterBase
{
    public override bool IsConverter(IPublishedPropertyType propertyType)
    {
        return propertyType.EditorAlias.Equals("Digbyswift.Umbraco.SeoEditor");
    }

    public override Type GetPropertyValueType(IPublishedPropertyType propertyType) => typeof(SeoEditorModel);

    public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) => PropertyCacheLevel.Element;

    public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
    {
        if (inter is string stringInter)
            return JsonConvert.DeserializeObject<SeoEditorModel>(stringInter);

        return null;
    }
}