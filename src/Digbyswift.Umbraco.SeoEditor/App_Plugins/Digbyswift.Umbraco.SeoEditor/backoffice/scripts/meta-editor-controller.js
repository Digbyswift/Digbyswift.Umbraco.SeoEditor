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
        const defaultModelValue = {
            metaTitle: null,
            metaDescription: null,
            metaImageId: null,
            canonicalUrl: null,
            metaRobots: []
        }

        $scope.ds = {
            isLoading: true,
            data: {
                activeVariantName: currentState.variants.filter(x => x.active)[0].name,
                robotOptions: robotOptions,
                metaImageUrl: '',
                preview: {
                    baseUrl: `${location.protocol}//${location.hostname}`
                }
            },
            toggleOptions: toggleOptions,
            getTitle: getTitle,
            getDescription: getDescription,
            getPath: getPath,
            openMediaPicker: openMediaPicker,
            addMediaItem: addMediaItem,
            resetMediaPicker: removeMetaImage,
            isPreviewEnabled: modelHasDataForPreview
        };

        if (!modelHasValue()) {
            $scope.model.value = {};
        }

        if (currentState.id === 0) {
            $scope.ds.isLoading = false;
        }
        else {

            // Set the preview URL
            contentResource.getCultureAndDomains(currentState.id)
                .then(function (data) {
                    if (data.domains.length >= 1 && data.domains[0].name) {
                        $scope.ds.data.preview.url = data.domains[0].name;
                    }

                    $scope.ds.isLoading = false;
                });

            // Set the selected media
            if ($scope.model.value.hasOwnProperty('metaImageId') && $scope.model.value.metaImageId !== null) {
                mediaResource.getById($scope.model.value.metaImageId)
                    .then(function (item) {
                        $scope.ds.data.metaImageUrl = `/umbraco/backoffice/umbracoapi/images/GetBigThumbnail?originalImagePath=${item.mediaLink}&rnd=0.9892062282743543`;
                    });
            }
        }

        // Model value checks
        // ------------------

        function modelHasValue() {
            return typeof $scope.model.value === 'object';
        }

        function modelHasDataForPreview() {
            if (!modelHasValue()){
                return false;
            }

            if ((!$scope.model.value.hasOwnProperty('metaTitle') || $scope.model.value.metaTitle === null) && currentState.variants.filter(x => x.active)[0].name === '') {
                return false;
            }

            return true;
        }


        // Robots toggle functions
        // -----------------------

        function toggleOptions(option) {
            if (!$scope.model.value.hasOwnProperty('metaRobots')) {
                $scope.model.value.metaRobots = [];
            }

            const idx = $scope.model.value.metaRobots.indexOf(option);
            if (idx === -1) {
                $scope.model.value.metaRobots.push(option);
            }
            else {
                $scope.model.value.metaRobots.splice(idx, 1);
            }
        }


        // Media picker functions
        // ----------------------

        function openMediaPicker() {
            editorService.mediaPicker({
                multiPicker: false,
                filterCssClass: "not-allowed not-published",
                submit: function (data) {
                    data.selection.forEach(item => $scope.ds.addMediaItem(item));
                    editorService.close();
                },
                close: function () {
                    editorService.close();
                }
            });
        }

        function addMediaItem(item) {
            $scope.model.value.metaImageId = item.id;
            $scope.ds.data.metaImageUrl = item.thumbnail;
        }

        function removeMetaImage() {
            $scope.model.value.metaImageId = null;
            $scope.ds.data.metaImageUrl = null;
        }


        // Preview functions
        // -----------------

        function getTitle() {
            return truncateString($scope.model.value.metaTitle || currentState.variants.filter(x => x.active)[0].name, maxRecommendedTitleLength, ' ...');
        }

        function getDescription() {
            if ($scope.model.value.metaDescription === null) {
                return;
            }

            return truncateString($scope.model.value.metaDescription, maxRecommendedDescriptionLength, ' ...');
        }

        function getPath() {

            const currentInternalPath = currentState.urls.length >= 1 && currentState.urls[0].isUrl
                ? currentState.urls[0].text
                : null;

            let canonicalUrl = $scope.model.value.canonicalUrl || currentInternalPath;
            if (canonicalUrl == null) {
                return null;
            }

            if (canonicalUrl.indexOf('/') > -1) {
                const urlParts = canonicalUrl.split('/').filter((x) => x !== '');
                return ` › ${urlParts.join(' › ')}`;
            }

            return ` › ${canonicalUrl}`;
        }

        function truncateString(str, maxLength, append) {
            if (!str || str.length <= maxLength) {
                return str;
            }

            const trimmedString = str.substring(0, maxLength);
            return trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))) + (append || '');
        }

    }

    angular.module("umbraco").controller("Digbyswift.Umbraco.MetaEditorController", ['$scope', 'editorState', 'editorService', 'contentResource', 'mediaResource', controller]);
})();
