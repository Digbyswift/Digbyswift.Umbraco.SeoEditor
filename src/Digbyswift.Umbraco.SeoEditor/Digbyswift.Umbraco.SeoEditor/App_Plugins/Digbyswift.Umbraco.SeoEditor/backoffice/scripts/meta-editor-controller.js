(function () {
    "use strict";

    function controller($scope, editorState, editorService, contentResource, mediaResource) {

        const maxRecommendedTitleLength = 60;
        const maxRecommendedDescriptionLength = 160;
        const robotOptions = [
            'noindex',
            'nofollow',
            'noarchive',
            'nositelinkssearchbox',
            'nosnippet',
            'indexifembedded',
            'noimageindex',
        ];

        const currentState = editorState.getCurrent();

        console.log(currentState);

        contentResource.getCultureAndDomains(currentState.id)
            .then(function (data) {
                $scope.ds.domain = data.domains.length == 0
                    ? `${location.protocol}//${location.hostname}`
                    : data.domains[0].substring(0, data.domains[0].length - 1);

                $scope.ds.loading = false;
            });

        if ($scope.model.value.metaImageId) {
            mediaResource.getById($scope.model.value.metaImageId)
                .then(function (item) {
                    $scope.ds.metaImageUrl = `/umbraco/backoffice/umbracoapi/images/GetBigThumbnail?originalImagePath=${item.mediaLink}&rnd=0.9892062282743543`;
                });
        }

        $scope.ds = {};
        $scope.ds.loading = true;
        $scope.ds.defaultVariant = currentState.variants[0];
        $scope.ds.robotOptions = robotOptions;
        $scope.ds.url = $scope.model.culture !== null
            ? currentState.urls.filter((x) => x.culture === $scope.model.culture)[0].text
            : currentState.urls[0].text;

        $scope.ds.metaTitle = $scope.model.value.metaTitle || null;
        $scope.ds.metaDescription = $scope.model.value.metaDescription || null;
        $scope.ds.metaImageId = $scope.model.value.metaImageId || null;
        $scope.ds.metaRobots = $scope.model.value.metaRobots || [];
        $scope.ds.canonicalUrl = $scope.model.value.canonicalUrl || null;
        $scope.ds.hidePreview = canHidePreview();
        $scope.ds.toggleOptions = toggleOptions;
        $scope.ds.getTitle = getTitle;
        $scope.ds.getDescription = getDescription;
        $scope.ds.getPath = getPath;
        $scope.ds.removeMetaImage = removeMetaImage;

        $scope.$watch('ds.metaTitle', () => updateModel());
        $scope.$watch('ds.metaDescription', () => updateModel());
        $scope.$watch('ds.canonicalUrl', () => updateModel());
        $scope.$watch('ds.metaImageId', () => updateModel());

        $scope.model.value = {
            metaTitle: $scope.ds.metaTitle,
            metaDescription: $scope.ds.metaDescription,
            metaImageId: $scope.ds.metaImageId,
            metaRobots: $scope.ds.metaRobots,
            canonicalUrl: $scope.ds.canonicalUrl,
        };

        var dialogOptions = {
            multiPicker: false,
            filterCssClass: "not-allowed not-published",
            submit: function (data) {
                data.selection.forEach(item => $scope.ds.add(item));
                editorService.close();
            },
            close: function () {
                editorService.close();
            }
        };

        $scope.ds.openMediaPicker = function () {
            editorService.mediaPicker(dialogOptions);
        };

        $scope.ds.add = function (item) {
            $scope.ds.metaImageUrl = item.thumbnail;
            $scope.ds.metaImageId = item.id;
        };

        function updateModel() {
            $scope.model.value = {
                metaTitle: $scope.ds.metaTitle,
                metaDescription: $scope.ds.metaDescription,
                metaImageId: $scope.ds.metaImageId,
                metaRobots: $scope.ds.metaRobots,
                canonicalUrl: $scope.ds.canonicalUrl,
            };

            $scope.ds.hidePreview = canHidePreview();
        };

        function toggleOptions(option) {
            var idx = $scope.ds.metaRobots.indexOf(option);
            if (idx > -1) {
                $scope.ds.metaRobots.splice(idx, 1);
            }
            else {
                $scope.ds.metaRobots.push(option);
            }

            updateModel();
        }

        function canHidePreview() {
            return $scope.ds.metaRobots && (
                $scope.ds.metaRobots.indexOf('noindex') > -1 ||
                $scope.ds.metaRobots.indexOf('nosnippet') > -1
            );
        }

        function getTitle() {
            return truncateString($scope.ds.metaTitle || $scope.ds.defaultVariant.name, maxRecommendedTitleLength, ' ...');
        }

        function getDescription() {
            return truncateString($scope.ds.metaDescription, maxRecommendedDescriptionLength, ' ...');
        }

        function getPath() {
            var canonicalUrl = $scope.ds.canonicalUrl || $scope.ds.url;
            if (canonicalUrl.indexOf('/') !== 0) canonicalUrl = 'colliding-urls';
            var urlParts = canonicalUrl.split('/').filter((x) => x !== '');
            return ` › ${urlParts.join(' › ')}`;
        }

        function removeMetaImage() {
            $scope.ds.metaImageId = null;
            $scope.ds.metaImageUrl = null;
        }

        function truncateString(str, maxLength, append) {
            if (!str || str.length <= maxLength) {
                return str;
            }

            var trimmedString = str.substr(0, maxLength);
            return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))) + (append || '');
        }
    }

    angular.module("umbraco").controller("Digbyswift.Umbraco.MetaEditorController", ['$scope', 'editorState', 'editorService', 'contentResource', 'mediaResource', controller]);
})();
